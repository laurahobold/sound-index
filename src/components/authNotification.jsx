import { useEffect } from "react";
import { notification, Button, Space } from "antd";
import { ReloadOutlined, LoginOutlined } from "@ant-design/icons";

export default function AuthNotification({
		loginPath = "/sorter/pick",
		placement = "top",
		message = "Spotify session expired",
		description = "Your Spotify session expired. Log in again to keep using the tools.",
		duration = 0, // 0 = persistent
		eventName = "auth:expired",
}) {
		const [api, contextHolder] = notification.useNotification();

		useEffect(() => {
				const onExpired = () => {
						api.error({
								message,
								description,
								placement,
								duration,
								btn: (
										<Space>
												<Button
														onClick={() => window.location.reload()}
														icon={<ReloadOutlined />}
														size="small"
												>
														Reload
												</Button>
												<Button
														type="primary"
														onClick={() => window.location.assign(loginPath)}
														icon={<LoginOutlined />}
														size="small"
												>
														Login again
												</Button>
										</Space>
								),
								key: "auth-expired",
						});
				};

				window.addEventListener(eventName, onExpired);
				return () => window.removeEventListener(eventName, onExpired);
		}, [api, description, duration, eventName, loginPath, message, placement]);

		return contextHolder; // renders the AntD notification portal
}
