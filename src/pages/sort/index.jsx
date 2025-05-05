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

const ProgressBar = styled.div`
    width: 100%;
    background: #ddd;
    height: 10px;
    border-radius: 5px;
    margin-bottom: 1rem;
`;

const ProgressFill = styled.div`
    background: #1db954;
    height: 100%;
    border-radius: 5px;
    transition: width 0.3s ease;
`;

export default function SortPage({ sortingStack, setSortingStack, rankedTracks = [], setRankedTracks }) {
    const navigate = useNavigate();

    const total = sortingStack.length + rankedTracks.length;
    const remaining = sortingStack.length;
    const progress = total > 0 ? Math.round(((total - remaining) / total) * 100) : 0;

    function handleSort(left, right, preferred) {
        const nextStack = sortingStack.slice(2); // remove first 2
        const winner = preferred === "left" ? left : right;
        const loser = preferred === "left" ? right : left;

        nextStack.push(winner); // winner stays in pool

        const updatedRanked = [...rankedTracks, loser];
        setRankedTracks(updatedRanked);

        if (nextStack.length === 1) {
            // Only one song left — must be the top choice
            setRankedTracks([...updatedRanked, nextStack[0]]);
            setSortingStack([]);
            navigate("/result");
        } else {
            setSortingStack(nextStack);
        }
    }

    if (sortingStack.length < 2) return <Container>Loading tracks...</Container>;

    return (
        <Container>
            <h2>Which song do you prefer?</h2>
            <ProgressBar>
                <ProgressFill style={{ width: `${progress}%` }} />
            </ProgressBar>

            <Button onClick={() => handleSort(sortingStack[0], sortingStack[1], "left")}>
                {sortingStack[0].name}
            </Button>
            <Button onClick={() => handleSort(sortingStack[0], sortingStack[1], "right")}>
                {sortingStack[1].name}
            </Button>
        </Container>
    );
}
