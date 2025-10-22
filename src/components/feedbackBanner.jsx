// App.jsx (or a Layout component)
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export function AuthBanner() {
		const [visible, setVisible] = useState(false);
		const navigate = useNavigate();

		useEffect(() => {
				const onExpired = () => setVisible(true);
				window.addEventListener("auth:expired", onExpired);
				return () => window.removeEventListener("auth:expired", onExpired);
		}, []);

		if (!visible) return null;

		return (
				<Banner role="alert">
						<Msg>Your Spotify session expired. Please log in again.</Msg>
						<Actions>
								<Retry onClick={() => window.location.reload()}>Reload</Retry>
								<Login onClick={() => navigate("/tools/sorter/pick")}>Login again</Login>
						</Actions>
				</Banner>
		);
}

const Banner = styled.div`
  position: sticky;
  top: 0;
  z-index: 999;
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  background: #2a2a2a;
  border-bottom: 1px solid rgba(255,255,255,0.12);
  color: #fff;
`;

const Msg = styled.div`
  font-size: 0.95rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const Btn = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(255,255,255,0.06);
  color: #fff;
  cursor: pointer;
  &:hover { transform: translateY(-1px); }
`;

const Retry = styled(Btn)``;
const Login = styled(Btn)``;

// then inside your App component JSX:
{/* <AuthBanner /> */}
