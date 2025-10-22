// SortPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import {ContainerHeader} from "./styles.module.js";
import {fonts} from "../../../styles/theme.js";

function shuffle(arr) {
		const a = arr.slice();
		for (let i = a.length - 1; i > 0; i--) {
				const j = (Math.random() * (i + 1)) | 0;
				[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
}
function worstCaseComparisons(n) {
		if (n <= 1) return 0;
		// Start with n runs of size 1
		let sizes = Array(n).fill(1);
		let total = 0;
		while (sizes.length > 1) {
				const next = [];
				for (let k = 0; k < sizes.length; k += 2) {
						if (k + 1 < sizes.length) {
								const a = sizes[k], b = sizes[k + 1];
								total += (a + b - 1);
								next.push(a + b);
						} else {
								// odd run bubbles to next round unchanged
								next.push(sizes[k]);
						}
				}
				sizes = next;
		}
		return total; }
// Rough upper-bound for merge-sort comparisons (good enough for a UX progress bar)
function estimateComparisons(n) {
		if (n <= 1) return 0;
		const levels = Math.ceil(Math.log2(n));
		return Math.ceil(n * levels);
}

export default function SortPage({ sortingStack, setSortingStack, setRankedTracks }) {
		const navigate = useNavigate();
		const location = useLocation();

		// Runs are the “chunks” to merge. Start with singleton runs: [[a],[b],[c],...]
		const [runs, setRuns] = useState([]);
		// Current active merge pair and working buffer
		const [left, setLeft] = useState([]);
		const [right, setRight] = useState([]);
		const [i, setI] = useState(0);
		const [j, setJ] = useState(0);
		const [merged, setMerged] = useState([]);
		// Progress tracking
		const [comparisonsDone, setComparisonsDone] = useState(0);
		const [totalComparisons, setTotalComparisons] = useState(0);

		// Hydrate initial track list from props -> route state -> sessionStorage
		useEffect(() => {
				// 1) Props
				if (Array.isArray(sortingStack) && sortingStack.length > 1) {
						seedFromList(sortingStack);
						return;
				}
				// 2) Route state
				const fromNav = location.state?.tracks;
				if (Array.isArray(fromNav) && fromNav.length > 1) {
						if (typeof setSortingStack === "function") setSortingStack(fromNav);
						sessionStorage.setItem("si_sortingStack", JSON.stringify(fromNav));
						seedFromList(fromNav);
						return;
				}
				// 3) sessionStorage
				try {
						const saved = JSON.parse(sessionStorage.getItem("si_sortingStack") || "[]");
						if (Array.isArray(saved) && saved.length > 1) {
								if (typeof setSortingStack === "function") setSortingStack(saved);
								seedFromList(saved);
						}
				} catch {}
		}, [sortingStack, location.state]);

		function seedFromList(list) {
				const shuffled = shuffle(list);
				const initialRuns = shuffled.map(x => [x]);
				setRuns(initialRuns);
				setComparisonsDone(0);
				setTotalComparisons(worstCaseComparisons(shuffled.length)); // ← accurate now
		}

		// Pull next pair to merge when needed
		useEffect(() => {
				if ((left.length === 0 && right.length === 0) && runs.length >= 2) {
						const nextLeft = runs[0];
						const nextRight = runs[1];
						setLeft(nextLeft);
						setRight(nextRight);
						setI(0);
						setJ(0);
						setMerged([]);
						setRuns(prev => prev.slice(2)); // remove the two we’re merging
				}
				// If no active pair and <= 1 run remains, we might be finished
				if ((left.length === 0 && right.length === 0) && runs.length === 1) {
						const finalList = runs[0];
						if (finalList && finalList.length) {
								if (typeof setRankedTracks === "function") setRankedTracks(finalList);
								if (typeof setSortingStack === "function") setSortingStack([]);
								sessionStorage.setItem("si_rankedTracks", JSON.stringify(finalList));
								navigate("/sorter/result");
						}
				}
		}, [left, right, runs]);

		// Choose handlers — always compare left[i] vs right[j]
		function chooseLeft() {
				if (i < left.length && j < right.length) {
						setMerged(prev => [...prev, left[i]]);
						setI(prev => prev + 1);
						setComparisonsDone(prev => prev + 1);
				} else {
						finalizeMerge();
				}
		}

		function chooseRight() {
				if (i < left.length && j < right.length) {
						setMerged(prev => [...prev, right[j]]);
						setJ(prev => prev + 1);
						setComparisonsDone(prev => prev + 1);
				} else {
						finalizeMerge();
				}
		}

		// When one side is exhausted, append the rest and push the merged run back to queue
		function finalizeMerge() {
				const tailLeft = left.slice(i);
				const tailRight = right.slice(j);
				const mergedRun = [...merged, ...tailLeft, ...tailRight];

				// Put merged run at the end; if there are at least two more runs, the loop continues
				setRuns(prev => [...prev, mergedRun]);
				// Reset active pair
				setLeft([]);
				setRight([]);
				setI(0);
				setJ(0);
				setMerged([]);
		}

		// If we have an active pair and one side is out, finalize automatically
		useEffect(() => {
				if ((left.length && i >= left.length) || (right.length && j >= right.length)) {
						finalizeMerge();
				}
				// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [i, j]);

		const canPlay = (left.length > 0 && right.length > 0 && i < left.length && j < right.length);

		const percent = useMemo(() => {
				if (!totalComparisons) return 0;
				return Math.min(100, Math.round((comparisonsDone / totalComparisons) * 100));
		}, [comparisonsDone, totalComparisons]);

		if (runs.length === 0 && left.length === 0 && right.length === 0) {
				return (
						<EmptyWrap>
								Preparing sorting game…
								<div>
										<BackBtn onClick={() => navigate("/tools/sorter/pick")}>
												Back to playlist pick
										</BackBtn>
								</div>
						</EmptyWrap>
				);
		}
		function ChoiceCard({ track, label }) {
				const handlePlay = (e) => {
						// pause any other previews that might be playing
						document.querySelectorAll("audio").forEach(a => {
								if (a !== e.currentTarget && !a.paused) a.pause();
						});
				};

				return (
						<Card>
								<ThumbWrap>
										{track?.cover ? (
												<Thumb src={track.cover} alt={track?.name || "cover"} loading="lazy" />
										) : (
												<NoThumb>no cover</NoThumb>
										)}
								</ThumbWrap>

								<CardText>
										<CardLabel>{label}</CardLabel>
										<CardTitle title={track?.name}>{track?.name || "Unknown"}</CardTitle>
										<CardSub title={track?.artists}>{track?.artists || ""}</CardSub>
										<CardSub title={track?.album}>{track?.album || ""}</CardSub>
								</CardText>


						</Card>
				);
		}


		return (
				<Wrap>
						<ContainerHeader>
								<ActionRow>
										<BackBtn onClick={() => navigate("/sorter/pick")}>
												←
										</BackBtn>
								</ActionRow>
								<SectionTitle>Pick one</SectionTitle>
						</ContainerHeader>



						{canPlay ? (
								<ChoicesGrid>
										<ChoiceButton onClick={chooseLeft}>
												<ChoiceCard track={left[i]} label="Pick" />
										</ChoiceButton>
										<SectionTitle>X</SectionTitle>
										<ChoiceButton onClick={chooseRight}>
												<ChoiceCard track={right[j]} label="Pick" />
										</ChoiceButton>
								</ChoicesGrid>
						) : (
								<Merging> Merging… </Merging>
						)}
						<ProgressWrap>
								<ProgressTrack>
										<ProgressBar style={{ width: `${percent}%` }} />
								</ProgressTrack>
								<ProgressMeta>
										<span>{comparisonsDone} / {totalComparisons} comparisons</span>
										<span>{percent}%</span>
								</ProgressMeta>
						</ProgressWrap>
				</Wrap>
		);
}

/* ===== styled-components ===== */

const Wrap = styled.div`
  padding: 24px;
  display: grid;
  gap: 16px;
`;

const EmptyWrap = styled.div`
  padding: 32px;
  text-align: center;
  display: grid;
  gap: 16px;
`;


const ProgressWrap = styled.div`
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
		margin-top: 1rem;
`;

const ProgressTrack = styled.div`
  height: 10px;
  background: rgba(255,255,255,0.12);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08);
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #63f, #1db954);
  transition: width 180ms ease;
`;

const ProgressMeta = styled.div`
  margin-top: 8px;
  font-size: 12px;
  opacity: 0.8;
  display: flex;
  justify-content: space-between;
`;

const ChoicesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 50px 1fr;
  gap: 16px;
  max-width: 900px;
  margin: 8px auto 0;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const ChoiceButton = styled.button`
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(4px);
  text-align: left;
  cursor: pointer;
  user-select: none;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0px);
  }
`;

const ChoiceCard = styled.div`
  display: grid;
  gap: 6px;
`;

const CardLabel = styled.div`
  font-size: 12px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  opacity: 0.7;
`;

const CardTitle = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 1.2;
`;

const CardSub = styled.div`
  opacity: 0.8;
  font-size: 14px;
`;

const Merging = styled.div`
  text-align: center;
  opacity: 0.8;
`;
const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BackBtn = styled.button`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(4px);
  cursor: pointer;
  user-select: none;
  font-weight: 600;

  &:hover { transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`;
const Card = styled.div`
  display: grid;
  grid-template-columns: 84px 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    "thumb text"
    "thumb audio";
  gap: 10px 14px;
  align-items: center;

  @media (max-width: 720px) {
    grid-template-columns: 64px 1fr;
  }
`;

const ThumbWrap = styled.div`
  grid-area: thumb;
  width: 84px;
  height: 84px;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255,255,255,0.06);
  display: grid;
  place-items: center;

  @media (max-width: 720px) {
    width: 64px;
    height: 64px;
  }
`;

const Thumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const NoThumb = styled.div`
  font-size: 10px;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const CardText = styled.div`
  grid-area: text;
  display: grid;
  gap: 6px;
  min-width: 0; /* enables text truncation */
`;



const AudioWrap = styled.div`
  grid-area: audio;
  display: flex;
  align-items: center;

  audio {
    width: 100%;
    outline: none;
  }
`;

const NoPreview = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;
const SectionTitle = styled.h2`
		font-size: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
    color: ${({ theme }) => theme.textMain};
    font-family: ${({theme}) => fonts.heading};
`;