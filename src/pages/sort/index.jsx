import styled from "styled-components";
import { useState, useEffect, useMemo, useCallback } from "react";
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
    &:disabled { background-color: #aaa; cursor: not-allowed; }
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

    // Build all unique track pairs
    const queue = useMemo(() => {
        if (!Array.isArray(sortingStack) || sortingStack.length < 2) return [];
        const pairs = [];
        for (let i = 0; i < sortingStack.length; i++) {
            for (let j = i + 1; j < sortingStack.length; j++) {
                pairs.push([sortingStack[i], sortingStack[j]]);
            }
        }
        return pairs;
    }, [sortingStack]);

    // Index of current pair
    const [idx, setIdx] = useState(0);

    // Reset idx whenever queue changes
    useEffect(() => {
        setIdx(0);
    }, [queue]);

    const total = queue.length;
    const progress = total > 0 ? Math.round((idx / total) * 100) : 0;

    // Handle user choice
    const handleSort = useCallback(
        (choice) => {
            // Guard bounds
            if (idx < 0 || idx >= queue.length) return;

            const pair = queue[idx];
            if (!Array.isArray(pair) || pair.length !== 2) return;

            const [left, right] = pair;
            const winner = choice === "left" ? left : right;
            const loser = choice === "left" ? right : left;

            // Update rankedTracks
            const updated = [...rankedTracks];
            if (!updated.some((t) => t.uri === winner.uri)) updated.unshift(winner);
            if (!updated.some((t) => t.uri === loser.uri)) updated.push(loser);
            setRankedTracks(updated);

            const next = idx + 1;
            if (next >= queue.length) {
                setSortingStack([]);
                navigate("/result");
            } else {
                setIdx(next);
            }
        },
        [idx, queue, rankedTracks, setRankedTracks, setSortingStack, navigate]
    );

    if (queue.length === 0) {
        return <Container>Loading sorting game...</Container>;
    }

    const [left, right] = queue[idx] || [];
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
