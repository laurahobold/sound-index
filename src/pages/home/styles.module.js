import styled from "styled-components";
import {Link} from "@radix-ui/themes";

export const Description = styled.small`
    padding: 0.2rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    font-family: "Space Grotesk", serif;
    color: ${({ theme }) => theme.textMuted};
    width: 70%;
    font-size: 1.3rem;
`;

export const Hero = styled.div`
  width: 80%;
		height: 100%;
  padding: 0.5rem;
  margin: auto;
  border-radius: 4px;
  font-size: 1.125rem;
  color: #1f1f1f;

`;

export const GettingStarted = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2.5rem;
  gap: 1.5rem;
  text-align: center;
`;
export const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
		justify-content: center;
  text-align: center;
`;
export const LearnMore = styled(Link)`
font-family: "Space Grotesk",serif;
		text-decoration: underline 1px ${({ theme }) => theme.textMain};
margin-top: 1rem;
    color: ${({ theme }) => theme.textMain};
cursor: pointer;
`;
