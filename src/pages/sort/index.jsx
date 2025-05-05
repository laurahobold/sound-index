import styled from "styled-components";
import { useEffect, useState } from "react";
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
    &:disabled {
        background-color: #aaa;
        cursor: not-allowed;
    }
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

export default function SortPage({ sortingStack, setSortingStack, rankedTracks, setRankedTracks }) {
    const navigate = useNavigate();
    const [queue, setQueue] = useState([]);
    const [roundTotal, setRoundTotal] = useState(0);

    useEffect(() => {
        if (Array.isArray(sortingStack) && sortingStack.length > 1 && queue.length === 0) {
            const initialQueue = [];
            for (let i = 0; i < sortingStack.length; i++) {
                for (let j = i + 1; j < sortingStack.length; j++) {
                    initialQueue.push([sortingStack[i], sortingStack[j]]);
                }
            }
            setQueue(initialQueue);
            setRoundTotal(initialQueue.length);
        }
    }, [sortingStack]);

    const progress = roundTotal > 0
        ? Math.round(((roundTotal - queue.length) / roundTotal) * 100)
        : 0;

    function handleSort(preferred) {
        if (!Array.isArray(queue) || queue.length === 0) return;
        const pair = queue[0];
        if (!Array.isArray(pair) || pair.length < 2) return;
        const left = pair[0];
        const right = pair[1];
        if (!left || !right) return;

        const winner = preferred === "left" ? left : right;
        const loser = preferred === "left" ? right : left;

        // Maintain rankings
        const updatedRankings = [...rankedTracks];
        if (!updatedRankings.find(t => t.uri === winner.uri)) updatedRankings.unshift(winner);
        if (!updatedRankings.find(t => t.uri === loser.uri)) updatedRankings.push(loser);
        setRankedTracks(updatedRankings);

        // Advance queue
        const remainingQueue = queue.slice(1);
        setQueue(remainingQueue);

        if (remainingQueue.length === 0) {
            setSortingStack([]);
            navigate("/result");
        }
    }

    // Render loading if no valid pair
    if (!Array.isArray(queue) || queue.length === 0) {
        return <Container>Loading sorting game...</Container>;
    }

    const pair = queue[0];
    const left = Array.isArray(pair) ? pair[0] : null;
    const right = Array.isArray(pair) ? pair[1] : null;

    if (!left || !right) {
        return <Container>Preparing matchup...</Container>;
    }

    return (
        <Container>
            <h2>Which song do you prefer?</h2>
            <ProgressBar>
                <ProgressFill style={{ width: `${progress}%` }} />
            </ProgressBar>

            <Button onClick={() => handleSort("left")}>{left.name}</Button>
            <Button onClick={() => handleSort("right")}>{right.name}</Button>

            <p style={{ marginTop: "1rem" }}>{progress}% completed</p>
        </Container>
    );
}
