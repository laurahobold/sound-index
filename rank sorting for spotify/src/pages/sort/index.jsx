import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 2rem;
  text-align: center;
`;

const Button = styled.button`
  background-color: #1db954;
  color: white;
  margin: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
`;

export default function SortPage({ sortingStack, setSortingStack, setRankedTracks }) {
  const navigate = useNavigate();

  function handleSort(left, right, preferred) {
    const nextStack = [...sortingStack];
    const leftIndex = nextStack.indexOf(left);
    const rightIndex = nextStack.indexOf(right);
    if (preferred === "left") {
      nextStack.splice(rightIndex, 1);
    } else {
      nextStack.splice(leftIndex, 1);
    }
    if (nextStack.length === 1) {
      setRankedTracks([nextStack[0], ...(preferred === "left" ? [right] : [left])]);
      navigate("/result");
    } else {
      setSortingStack(nextStack);
    }
  }

  if (sortingStack.length < 2) return <Container>Loading tracks...</Container>;

  return (
    <Container>
      <h2>Which song do you prefer?</h2>
      <Button onClick={() => handleSort(sortingStack[0], sortingStack[1], "left")}>{sortingStack[0].name}</Button>
      <Button onClick={() => handleSort(sortingStack[0], sortingStack[1], "right")}>{sortingStack[1].name}</Button>
    </Container>
  );
}