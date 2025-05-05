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
        if (sortingStack.length > 1 && queue.length === 0) {
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

    const progress = roundTotal > 0 ? Math.round(((roundTotal - queue.length) / roundTotal) * 100) : 0;

    function handleSort(preferred) {
        const [left, right] = queue[0];
        const winner = preferred === "left" ? left : right;
        const loser = preferred === "left" ? right : left;

        const updatedRankings = [...rankedTracks];
        if (!updatedRankings.includes(winner)) updatedRankings.unshift(winner);
        if (!updatedRankings.includes(loser)) updatedRankings.push(loser);

        setRankedTracks(updatedRankings);
        const remainingQueue = queue.slice(1);
        setQueue(remainingQueue);

        if (remainingQueue.length === 0) {
            setSortingStack([]);
            navigate("/result");
        }
    }

    if (queue.length === 0) return <Container>Loading sorting game...</Container>;

    const [left, right] = queue[0];

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
