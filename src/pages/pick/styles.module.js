import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
    //overflow: scroll !important;
`;
export const SectionTitle = styled.h2`
color: #1a1a1a;    //overflow: scroll !important;
		font-size: 3rem;
		font-family: "Space Grotesk";
		margin-bottom: 2rem;
`;

export const ContainerHeader = styled.div`
padding:2rem;
    margin-bottom: 2rem;

`;

export const SearchInput = styled.input`
  width: 80%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

export const PlaylistGrid = styled.div`
		gap:1rem;
		display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    overflow-y: scroll;
    height: 67vh !important;
}

`;

export const Card = styled.div`
  background: #fafafa;
  border-radius: 8px;
		width: 20%;
  overflow: hidden;
		display: flex;
		flex-direction: column;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s;
  &:hover { transform: translateY(-4px); }
`;

export const Cover = styled.img`
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
  background: #eee;
`;

export const Title = styled.div`
  padding: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
