import styled from "styled-components";
import { useState, useEffect } from "react";
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

// Fisher-Yates shuffle
function shuffle(array) {
    const arr = [...array];
    let m = arr.length;
    while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
}

export default function SortPage({ sortingStack, setSortingStack, setRankedTracks }) {
    const navigate = useNavigate();
    const n = Array.isArray(sortingStack) ? sortingStack.length : 0;

    // Full random order for insertion
    const [order, setOrder] = useState([]);
    // Sorted list being built
    const [sortedList, setSortedList] = useState([]);
    // Index of next item to insert
    const [nextIndex, setNextIndex] = useState(1);
    // Bounds for binary search insertion
    const [low, setLow] = useState(0);
    const [high, setHigh] = useState(0);

    // Initialize on mount
    useEffect(() => {
        if (n > 0) {
            const shuffled = shuffle(sortingStack);
            setOrder(shuffled);
            setSortedList([shuffled[0]]);
            setNextIndex(1);
            setLow(0);
            setHigh(1);
        }
    }, [sortingStack]);

    // Reset bounds when sortedList grows
    useEffect(() => {
        setLow(0);
        setHigh(sortedList.length);
    }, [sortedList]);

    // Compute progress: percentage of items placed
    const progress = n > 0
        ? Math.round(((nextIndex) * 100) / n)
        : 100;

    // If finished inserting all items, finalize
    useEffect(() => {
        if (n > 0 && nextIndex >= n) {
            setRankedTracks(sortedList);
            setSortingStack([]);
            navigate('/result');
        }
    }, [nextIndex, n, sortedList, setRankedTracks, setSortingStack, navigate]);

    // Guard for loading
    if (order.length < 2 || sortedList.length === 0) {
        return <Container>Preparing sorting game...</Container>;
    }

    const newTrack = order[nextIndex];
    const mid = Math.floor((low + high) / 2);
    const compareTrack = sortedList[mid];

    function handleChoice(choice) {
        if (nextIndex >= n) return;

        // Update bounds
        if (choice === 'left') {
            // User prefers newTrack over compareTrack => newTrack should come before => insert in [low, mid]
            setHigh(mid);
        } else {
            // User prefers compareTrack => newTrack goes after => insert in [mid+1, high]
            setLow(mid + 1);
        }

        // Check if bounds converged
        const newLow = choice === 'left' ? low : low;
        const newHigh = choice === 'left' ? mid : high;
        if (newLow >= newHigh) {
            // Insert at position newLow
            const updated = [...sortedList];
            updated.splice(newLow, 0, newTrack);
            setSortedList(updated);
            setNextIndex(idx => idx + 1);
        }
    }

    return (
        <Container>
            <h2>Which song do you prefer?</h2>
            <ProgressBar><ProgressFill style={{ width: `${progress}%` }} /></ProgressBar>
            <Button onClick={() => handleChoice('left')}>{newTrack.name}</Button>
            <Button onClick={() => handleChoice('right')}>{compareTrack.name}</Button>
            <p style={{ marginTop: '1rem' }}>{progress}% sorted</p>
        </Container>
    );
}
