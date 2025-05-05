import styled from "styled-components";
import { useEffect, useState, useMemo, useCallback } from "react";
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

    // derive the queue of all unique pairs
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

    // current pair index
    const [idx, setIdx] = useState(0);

    // always start at 0 when the queue changes
    useEffect(() => {
        setIdx(0);
    }, [queue]);

    const total = queue.length;
    const progress = total > 0 ? Math.round((idx / total) * 100) : 0;

    const handleSort = useCallback((preferred) => {
        // guard against out-of-bounds
        if (idx < 0 || idx >= queue.length) {
            console.warn("Invalid index", idx, queue);
            return;
        }

        if (!left || !right) {
            console.warn("Bad pair at idx", idx, queue[idx]);
            return;
        }
        const pair = queue[idx];
           console.log("handleSort ▶️", { idx, pair, queueLength: queue.length });
           if (!Array.isArray(pair) || pair.length !== 2) {
               console.error("🛑 Invalid pair at index", idx, pair);
                 return;
               }
           const [left, right] = pair;
        const winner = preferred === "left" ? left : right;
        const loser = preferred === "left" ? right : left;

        // update rankedTracks
        const updated = [...rankedTracks];
        if (!updated.find(t => t.uri === winner.uri)) updated.unshift(winner);
        if (!updated.find(t => t.uri === loser.uri)) updated.push(loser);
        setRankedTracks(updated);

        // next or finish
        if (idx + 1 >= total) {
            setSortingStack([]);
            navigate("/result");
        } else {
            setIdx(idx + 1);
        }
    }, [idx, queue, rankedTracks, setRankedTracks, setSortingStack, navigate, total]);

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
