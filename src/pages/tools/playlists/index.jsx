// src/pages/tools/playlists/index.jsx
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Avatar, Button as AntBtn, Drawer, Empty, Form, Input, InputNumber, message, Popconfirm, Space, Switch, Tag, Tooltip} from "antd";
import {CheckOutlined, CloseOutlined, DeleteOutlined, DragOutlined, EditOutlined, LinkOutlined, LockOutlined, ReloadOutlined, SaveOutlined, ScissorOutlined, SearchOutlined, UnlockOutlined} from "@ant-design/icons";
import {closestCenter, DndContext, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {spotifyApi, spotifyFetch} from "../../../services/index.js";
import {Actions, DangerButton, Description, DragHandle, DrawerActions, DrawerBar, DrawerBody, DrawerHeader, DrawerTitle, HeadBar, Main, PrimaryButton, RightMeta, SearchButton, SecondaryButton, Table, TrackArtists, TrackMeta, TrackRow, TrackTitle, Wrapper} from "./styles.module.js";
import {SectionHeader} from "../../../layout/styles.module.js";
import DataTable from "../../../components/Table/index.jsx";
import texts from "../../../texts/text.js";

// ---------- Helpers ----------
const fmtTime = (ms) => {
		const m = Math.floor (ms / 60000);
		const s = Math.floor (( ms % 60000 ) / 1000).toString ().padStart (2, "0");
		return `${m}:${s}`;
};
const ownerName = (p) => p?.owner?.display_name || p?.owner?.id || "—";

// ---------- Editable Cell ----------
const EditableContext = React.createContext (null);

function EditableRow ({index, ...props}) {
		const [ form ] = Form.useForm ();
		return ( <Form form={form} component={false}>
				<EditableContext.Provider value={form}>
						<tr {...props} />
				</EditableContext.Provider>
		</Form> );
}

function EditableCell ({
		editable, dataIndex, title, record, inputType, children, editing, onSwitchChange, ...restProps
}) {
		const form = React.useContext (EditableContext);

		useEffect (() => {
				if (editing) {
						form.setFieldsValue ({
								name: record.name, description: record.description, public: !!record.public,
						});
				}
		}, [ editing, form, record ]);

		let inputNode = null;
		if (inputType === "switch") {
				inputNode = ( <Switch
						checkedChildren="Public"
						unCheckedChildren="Private"
						defaultChecked={!!record.public}
						onChange={(val) => onSwitchChange?.(val, record)}
				/> );
		} else {
				inputNode = <Input allowClear/>;
		}

		return ( <td {...restProps}>
				{editable && editing ? ( <Form.Item
						name={dataIndex}
						style={{margin: 0}}
						rules={dataIndex === "name" ? [ {required: true, message: "Name is required"} ] : []}
				>
						{inputNode}
				</Form.Item> ) : ( children )}
		</td> );
}

// ---------- Main ----------
export default function LibraryEditor ({token}) {
		const [ loading, setLoading ] = useState (false);
		const [ playlists, setPlaylists ] = useState ([]);
		const [ selectedRowKeys, setSelectedRowKeys ] = useState ([]);
		const [ q, setQ ] = useState ("");

		const [ drawerOpen, setDrawerOpen ] = useState (false);
		const [ activePlaylist, setActivePlaylist ] = useState (null);
		const [ tracksLoading, setTracksLoading ] = useState (false);
		const [ tracks, setTracks ] = useState ([]);
		const [ selectedTracks, setSelectedTracks ] = useState (new Set ());
		const [ snapshotId, setSnapshotId ] = useState (null);
		const [ savingOrder, setSavingOrder ] = useState (false);
		const [ removingTracks, setRemovingTracks ] = useState (false);

		// inline edit state
		const [ editingKey, setEditingKey ] = useState ("");
		const isEditing = (record) => record.id === editingKey;

		// DnD kit
		const sensors = useSensors (useSensor (PointerSensor, {activationConstraint: {distance: 6}}));
		const [ meId, setMeId ] = useState (null);
		const components = {body: {row: EditableRow, cell: EditableCell}};
		const onRow = (rec) => ( {
				onClick: () => {
						if (!editingKey) openPlaylist (rec);
				}, style: {cursor: editingKey ? "default" : "pointer"}
		} );
		useEffect (() => {
				if (!token) return;
				( async () => {
						try {
								const me = await spotifyApi.getMe (token);
								setMeId (me?.id || null);
						} catch {
								setMeId (null);
						}
				} ) ();
		}, [ token ]);

		const iOwn = React.useCallback ((pl) => Boolean (meId && pl?.owner?.id === meId), [ meId ]);

		// -------- Fetch playlists (all pages) --------
		const fetchAllPlaylists = useCallback (async () => {
				setLoading (true);
				try {
						const out = [];
						let url = `https://api.spotify.com/v1/me/playlists?limit=50&offset=0`;
						while (url) {
								const res = await spotifyFetch (url, {token});
								if (!res.ok) throw new Error (`HTTP ${res.status}`);
								const data = await res.json ();
								out.push (...( data.items || [] ));
								url = data.next;
						}
						setPlaylists (out);
				} catch (e) {
						console.error (e);
						message.error ("Couldn't load playlists.");
				} finally {
						setLoading (false);
				}
		}, [ token ]);

		useEffect (() => {
				if (token) fetchAllPlaylists ();
		}, [ token, fetchAllPlaylists ]);

		// -------- Delete/unfollow selected playlists --------
		const deleteSelected = async () => {
				const ids = selectedRowKeys.slice ();
				if (!ids.length) return;
				try {
						setLoading (true);
						await Promise.all (ids.map ((id) => spotifyFetch (`https://api.spotify.com/v1/playlists/${id}/followers`, {
								method: "DELETE", token
						})));
						message.success (`Removed ${ids.length} playlist${ids.length > 1 ? "s" : ""} from your library.`);
						setSelectedRowKeys ([]);
						await fetchAllPlaylists ();
				} catch (e) {
						console.error (e);
						message.error ("Some playlists could not be removed (permissions?).");
				} finally {
						setLoading (false);
				}
		};

		// -------- Open a playlist drawer --------
		const openPlaylist = async (pl) => {
				if (editingKey) return; // don't hijack click while editing
				setActivePlaylist (pl);
				setDrawerOpen (true);
				setSelectedTracks (new Set ());
				await loadTracks (pl.id);
		};

		const loadTracks = async (playlistId) => {
				setTracksLoading (true);
				try {
						const res = await spotifyFetch (`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&offset=0`, {token});
						if (!res.ok) throw new Error (`HTTP ${res.status}`);
						const data = await res.json ();
						const list = ( data.items || [] ).map ((it, idx) => {
								const t = it.track;
								return {
										key: t.id || `${t.uri}-${idx}`,
										id: t.id,
										uri: t.uri,
										name: t.name,
										artists: ( t.artists || [] ).map ((a) => a.name).join (", "),
										duration_ms: t.duration_ms,
										added_at: it.added_at,
										album: t.album?.name,
										cover: t.album?.images?.[2]?.url || t.album?.images?.[1]?.url || t.album?.images?.[0]?.url,
								};
						});
						setTracks (list);
						setSnapshotId (data.snapshot_id || null);
				} catch (e) {
						console.error (e);
						message.error ("Couldn't load tracks (maybe you don't have access to edit?).");
				} finally {
						setTracksLoading (false);
				}
		};

		// -------- Remove selected tracks --------
		const removeSelectedTracks = async () => {
				if (!activePlaylist) return;
				const uris = Array.from (selectedTracks);
				if (!uris.length) return;
				try {
						setRemovingTracks (true);
						const res = await spotifyFetch (`https://api.spotify.com/v1/playlists/${activePlaylist.id}/tracks`, {
								method: "DELETE", headers: {"Content-Type": "application/json"}, token, body: JSON.stringify ({
										tracks: uris.map ((u) => ( {uri: u} )), snapshot_id: snapshotId || undefined
								})
						});
						if (!res.ok) throw new Error (`HTTP ${res.status}`);
						const data = await res.json ().catch (() => ( {} ));
						setSnapshotId (data.snapshot_id || snapshotId);
						message.success (`Removed ${uris.length} track${uris.length > 1 ? "s" : ""}.`);
						setTracks ((prev) => prev.filter ((t) => !selectedTracks.has (t.uri)));
						setSelectedTracks (new Set ());
				} catch (e) {
						console.error (e);
						message.error ("Failed to remove some tracks (permissions or collaborative state?).");
				} finally {
						setRemovingTracks (false);
				}
		};

		// -------- Save ordering (replace all URIs) --------
		const saveOrder = async () => {
				if (!activePlaylist) return;
				if (tracks.length > 100) {
						message.warning ("This demo saves order for the first 100 tracks only (paging TODO).");
				}
				try {
						setSavingOrder (true);
						const res = await spotifyFetch (`https://api.spotify.com/v1/playlists/${activePlaylist.id}/tracks`, {
								method: "PUT",
								headers: {"Content-Type": "application/json"},
								token,
								body: JSON.stringify ({uris: tracks.map ((t) => t.uri)})
						});
						if (!res.ok) throw new Error (`HTTP ${res.status}`);
						let snapshot = null;
						try {
								const body = await res.json ();
								snapshot = body?.snapshot_id ?? null;
						} catch {
						}
						if (snapshot) setSnapshotId (snapshot);
						message.success ("Playlist order saved.");
				} catch (e) {
						console.error (e);
						message.error ("Couldn't save order (permissions?).");
				} finally {
						setSavingOrder (false);
				}
		};

		// -------- Tracks selection toggle --------
		const toggleTrack = (uri) => {
				setSelectedTracks ((prev) => {
						const next = new Set (prev);
						if (next.has (uri)) next.delete (uri); else next.add (uri);
						return next;
				});
		};

		// -------- Drag and drop --------
		const onDragEnd = (event) => {
				const {active, over} = event;
				if (!over || active.id === over.id) return;
				setTracks ((items) => {
						const oldIndex = items.findIndex ((t) => t.key === active.id);
						const newIndex = items.findIndex ((t) => t.key === over.id);
						return arrayMove (items, oldIndex, newIndex);
				});
		};

		// -------- Table data/filtering --------
		const filteredPlaylists = useMemo (() => {
				if (!meId) return []; // prevent flashing others' playlists before /me resolves
				const qq = q.trim ().toLowerCase ();
				const owned = playlists.filter ((p) => iOwn (p));
				if (!qq) return owned;
				return owned.filter ((p) => ( p.name || "" ).toLowerCase ().includes (qq) || ( ownerName (p) || "" ).toLowerCase ().includes (qq));
		}, [ q, playlists, meId, iOwn ]);

		const ownerFilters = useMemo (() => {
				const map = new Map ();
				playlists.forEach ((p) => {
						const id = p?.owner?.id;
						const text = p?.owner?.display_name || id || "—";
						if (id && !map.has (id)) map.set (id, {text, value: id});
				});
				return Array.from (map.values ()).slice (0, 50);
		}, [ playlists ]);

		function numberRangeFilter ({label = "Tracks", getValue}) {
				return {
						filterDropdown: ({setSelectedKeys, selectedKeys = [], confirm, clearFilters}) => {
								let seed = {};
								try {
										seed = JSON.parse (selectedKeys[0] || "{}");
								} catch {
								}
								const [ min, setMin ] = React.useState (seed.min ?? null);
								const [ max, setMax ] = React.useState (seed.max ?? null);
								const apply = () => {
										setSelectedKeys ([ JSON.stringify ({min, max}) ]);
										confirm ();
								};
								const reset = () => {
										setSelectedKeys ([]);
										clearFilters?.();
										confirm ();
								};
								return ( <div style={{padding: 8, width: 220}}>
										<div style={{marginBottom: 8, fontWeight: 600}}>{label} range</div>
										<Space>
												<InputNumber placeholder="Min" value={min} onChange={setMin} min={0} style={{width: 90}}/>
												<InputNumber placeholder="Max" value={max} onChange={setMax} min={0} style={{width: 90}}/>
										</Space>
										<Space style={{marginTop: 8}}>
												<AntBtn type="primary" size="small" onClick={apply}>Filter</AntBtn>
												<AntBtn size="small" onClick={reset}>Reset</AntBtn>
										</Space>
								</div> );
						}, onFilter: (encoded, record) => {
								let min, max;
								try {
										( {min, max} = JSON.parse (encoded || "{}") );
								} catch {
								}
								const v = Number (getValue (record) ?? 0);
								const ge = ( min == null ) || ( v >= min );
								const le = ( max == null ) || ( v <= max );
								return ge && le;
						}, filterIcon: (active) => <SearchOutlined style={{color: active ? "#1677ff" : undefined}}/>,
				};
		}

		// -------- Save playlist edits --------
		const savePlaylistEdits = async (id, values) => {
				try {
						const body = {};
						if (typeof values.name === "string") body.name = values.name;
						if (typeof values.description === "string") body.description = values.description;
						if (typeof values.public === "boolean") body.public = values.public;

						const res = await spotifyFetch (`https://api.spotify.com/v1/playlists/${id}`, {
								method: "PUT", headers: {"Content-Type": "application/json"}, token, body: JSON.stringify (body)
						});
						if (!res.ok) throw new Error (`HTTP ${res.status}`);

						setPlaylists ((prev) => prev.map ((p) => ( p.id === id ? {...p, ...body} : p )));
						setEditingKey ("");
						message.success ("Playlist updated.");
				} catch (e) {
						console.error (e);
						message.error ("Update failed (permissions/scope?).");
				}
		};

		// -------- Edit handlers --------
		const edit = (record) => setEditingKey (record.id);
		const cancel = () => setEditingKey ("");
		const handleSwitchVisibility = async (val, record) => {
				// immediate save for visibility toggle
				await savePlaylistEdits (record.id, {public: val});
		};
		const save = async (form, id) => {
				const values = await form.validateFields ();
				await savePlaylistEdits (id, values);
		};


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @                                                                   @
// @                                                                   @
// @   ██████╗ ██████╗ ██╗     ██╗   ██╗███╗   ███╗███╗   ██╗███████╗  @
// @  ██╔════╝██╔═══██╗██║     ██║   ██║████╗ ████║████╗  ██║██╔════╝  @
// @  ██║     ██║   ██║██║     ██║   ██║██╔████╔██║██╔██╗ ██║███████╗  @
// @  ██║     ██║   ██║██║     ██║   ██║██║╚██╔╝██║██║╚██╗██║╚════██║  @
// @  ╚██████╗╚██████╔╝███████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚████║███████║  @
// @   ╚═════╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═══╝╚══════╝  @
// @                                                                   @
// @                                                                   @
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

		const columns = [ {
				title: "", dataIndex: "images", key: "cover", width: 20, render: (images) => {
						const url = images?.[2]?.url || images?.[1]?.url || images?.[0]?.url;
						return <Avatar shape="square" size={30} src={url}/>;
				}
		}, {
				title: "Playlist",
				dataIndex: "name",
				key: "name",
				width: 100,
				ellipsis: true,
				sorter: (a, b) => ( a.name || "" ).localeCompare (b.name || ""),
				editable: true
		}, // {
				// 		title: "Description",
				// 		dataIndex: "description",
				// 		key: "description",
				// 		width: 50,
				// 		ellipsis: true,
				// 		editable: true,
				// 		render: (val) => (val ? <span dangerouslySetInnerHTML={{ __html: val }} /> : <span style={{ opacity: 0.6
				// }}>—</span>) }, { title: "Owner", dataIndex: ["owner", "display_name"], key: "owner", width: 120, filters:
				// ownerFilters, onFilter: (val, rec) => rec?.owner?.id === val, sorter: (a, b) =>
				// ownerName(a).localeCompare(ownerName(b)), render: (_, rec) => <span>{ownerName(rec)}</span> },
				{
						title: "Tracks",
						dataIndex: [ "tracks", "total" ],
						key: "total",
						width: 50,
						sorter: (a, b) => ( a?.tracks?.total ?? 0 ) - ( b?.tracks?.total ?? 0 ), ...numberRangeFilter ({
								label: "Tracks", getValue: (rec) => rec?.tracks?.total ?? 0
						}),
				}, {
						title: "Visibility",
						dataIndex: "public",
						key: "public",
						width: 50,
						editable: true,
						render: (pub) => pub ? <Tag color="green" icon={<UnlockOutlined/>}>Public</Tag> :
								<Tag color="default" icon={<LockOutlined/>}>Private</Tag>
				}, // {
				// 		title: "Open",
				// 		key: "open",
				// 		width: 70,
				// 		render: (_, rec) => (
				// 				<Tooltip title="Open playlist in Spotify">
				// 						<a
				// 								href={rec.external_urls?.spotify}
				// 								target="_blank"
				// 								rel="noreferrer"
				// 								onClick={(e) => e.stopPropagation()}
				// 						>
				// 								<LinkOutlined />
				// 						</a>
				// 				</Tooltip>
				// 		)
				// },
				{
						title: "Actions", key: "edit", width: 40, fixed: 'right', render: (_, record) => {
								const editing = isEditing (record);
								return editing ? ( <EditableContext.Consumer>
										{(form) => ( <Space>
												<AntBtn
														type="primary"
														size="small"
														icon={<CheckOutlined/>}
														onClick={(e) => {
																e.stopPropagation ();
																save (form, record.id);
														}}
												>
														Save
												</AntBtn>
												<AntBtn
														size="small"
														icon={<CloseOutlined/>}
														onClick={(e) => {
																e.stopPropagation ();
																cancel ();
														}}
												>
														Cancel
												</AntBtn>
										</Space> )}
								</EditableContext.Consumer> ) : ( <Space>
										<AntBtn
												size="small"
												icon={<EditOutlined/>}
												onClick={(e) => {
														e.stopPropagation ();
														edit (record);
												}}
										>
												Edit
										</AntBtn>
										<Tooltip title="Open playlist in Spotify">
												<a
														href={record.external_urls?.spotify}
														target="_blank"
														rel="noreferrer"
														onClick={(e) => e.stopPropagation ()}
												>
														<LinkOutlined/>
												</a>
										</Tooltip>
								</Space> );
						},
				} ];

		const mergedColumns = columns.map ((col) => {
				if (!( "editable" in col ) || !col.editable) return col;
				return {
						...col, onCell: (record) => ( {
								record,
								editable: col.editable,
								dataIndex: col.dataIndex,
								title: col.title,
								editing: isEditing (record),
								inputType: col.dataIndex === "public" ? "switch" : "text",
								onSwitchChange: handleSwitchVisibility
						} ),
				};
		});

		const rowSelection = {
				selectedRowKeys, columnWidth: 20, onChange: setSelectedRowKeys
		};
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @                                             @
// @                                             @
// @  ████████╗ █████╗ ██████╗ ██╗     ███████╗  @
// @  ╚══██╔══╝██╔══██╗██╔══██╗██║     ██╔════╝  @
// @     ██║   ███████║██████╔╝██║     █████╗    @
// @     ██║   ██╔══██║██╔══██╗██║     ██╔══╝    @
// @     ██║   ██║  ██║██████╔╝███████╗███████╗  @
// @     ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝  @
// @                                             @
// @                                             @
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

		return ( <Wrapper>
				<HeadBar>
						<Main>
								<SectionHeader>{texts.tools[1].name}</SectionHeader>
								<Description> {texts.tools[1].description}</Description>
						</Main>
						<Actions>
								<SearchButton
										allowClear
										placeholder="Search playlists…"
										prefix={<SearchOutlined/>}
										value={q}
										width="150px"
										onChange={(e) => setQ (e.target.value)}
								/>
								<SecondaryButton icon={<ReloadOutlined/>} onClick={fetchAllPlaylists} loading={loading}>
										Refresh
								</SecondaryButton> <Popconfirm
								title={`Remove ${selectedRowKeys.length} selected?`}
								okText="Yes, remove"
								okButtonProps={{danger: true}}
								disabled={!selectedRowKeys.length}
								onConfirm={deleteSelected}
						>
								<DangerButton icon={<DeleteOutlined/>} disabled={!selectedRowKeys.length} loading={loading}>
										Delete
								</DangerButton>
						</Popconfirm>
						</Actions>
				</HeadBar>

				<DataTable
						/* Everything below is exactly what you already pass to AntD <Table> */
						rowKey={(r) => r.id}
						columns={mergedColumns}
						dataSource={filteredPlaylists}
						components={components}
						rowSelection={rowSelection}
						onRow={onRow}
						pagination={{pageSize: 50}}
						tableLayout="fixed"
						scroll={{x: 900, y: "65vh"}}
				/>

				<Drawer
						width={720}
						open={drawerOpen}
						onClose={() => setDrawerOpen (false)}
						destroyOnClose
						styles={{body: {padding: 0}}}>
						{activePlaylist ? ( <>
								<DrawerHeader>
										<Avatar
												shape="square"
												size={52}
												src={activePlaylist.images?.[2]?.url || activePlaylist.images?.[1]?.url || activePlaylist.images?.[0]?.url}
										/>
										<div>
												<DrawerTitle>{activePlaylist.name}</DrawerTitle>
												<small>by {ownerName (activePlaylist)}</small>
										</div>
								</DrawerHeader>

								<DrawerBar>
										<DrawerActions>
												<Popconfirm
														title={`Remove ${selectedTracks.size} selected track${selectedTracks.size > 1 ? "s" : ""}?`}
														okText="Remove"
														okButtonProps={{danger: true}}
														disabled={selectedTracks.size === 0}
														onConfirm={removeSelectedTracks}
												>
														<DangerButton icon={<ScissorOutlined/>} disabled={selectedTracks.size === 0}
														              loading={removingTracks}>
																Remove selected
														</DangerButton>
												</Popconfirm>

												<PrimaryButton icon={<SaveOutlined/>} onClick={saveOrder} loading={savingOrder}
												               disabled={!tracks.length}>
														Save order
												</PrimaryButton>

												<SecondaryButton icon={<ReloadOutlined/>} onClick={() => loadTracks (activePlaylist.id)}
												                 loading={tracksLoading}>
														Reload tracks
												</SecondaryButton>
										</DrawerActions>
								</DrawerBar>

								<DrawerBody>
										{tracksLoading ? ( <div style={{padding: 24}}><Empty description="Loading…"/>
										</div> ) : tracks.length === 0 ? (
												<div style={{padding: 24}}><Empty description="No tracks to show."/></div> ) : (
												<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
														<SortableContext items={tracks.map ((t) => t.key)}
														                 strategy={verticalListSortingStrategy}>
																{tracks.map ((t, idx) => ( <SortableTrackRow
																		key={t.key}
																		id={t.key}
																		checked={selectedTracks.has (t.uri)}
																		onCheck={() => toggleTrack (t.uri)}
																		index={idx}
																		cover={t.cover}
																		title={t.name}
																		artists={t.artists}
																		duration={fmtTime (t.duration_ms)}
																/> ))}
														</SortableContext>
												</DndContext> )}
								</DrawerBody>
						</> ) : null}
				</Drawer>
		</Wrapper> );
}

// ---------- Sortable Track Row ----------
function SortableTrackRow ({id, checked, onCheck, index, cover, title, artists, duration}) {
		const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable ({id});
		const style = {
				transform: CSS.Transform.toString (transform), transition, opacity: isDragging ? 0.85 : 1
		};

		return ( <TrackRow ref={setNodeRef} style={style} $dragging={isDragging}>
				<DragHandle {...attributes} {...listeners}>
						<DragOutlined/>
				</DragHandle>

				<input
						type="checkbox"
						aria-label={`Select track ${title}`}
						checked={checked}
						onChange={onCheck}
						style={{marginRight: 12}}
				/>

				<Avatar shape="square" size={40} src={cover}/>

				<TrackMeta>
						<TrackTitle>{index + 1}. {title}</TrackTitle>
						<TrackArtists>{artists}</TrackArtists>
				</TrackMeta>

				<RightMeta>{duration}</RightMeta>
		</TrackRow> );
}
