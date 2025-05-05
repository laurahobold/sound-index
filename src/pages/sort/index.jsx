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
    width: 100%; background: #ddd; height: 10px;
    border-radius: 5px; margin-bottom: 1rem;
`;
const ProgressFill = styled.div`
    background: #1db954; height: 100%;
    border-radius: 5px; transition: width 0.3s ease;
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
    const totalPairs = n * (n - 1) / 2;

    // State
    const [optionsList, setOptionsList] = useState([]);
    const [sortingIterations, setSortingIterations] = useState(0);
    const [battleNum, setBattleNum] = useState(1);
    const [firstIdx, setFirstIdx] = useState(0);
    const [secondIdx, setSecondIdx] = useState(1);

    // Initialize on mount
    useEffect(() => {
        if (n > 1) {
            const shuffled = shuffle(sortingStack);
            setOptionsList(shuffled);
            setSortingIterations(shuffled.length - 1);
            setBattleNum(1);
            setFirstIdx(0);
            setSecondIdx(1);
        }
    }, [sortingStack]);

    // Compute progress
    const progress = totalPairs > 0
        ? Math.round(((battleNum - 1) * 100) / totalPairs)
        : 100;

    // Guard: loading
    if (optionsList.length < 2) {
        return <Container>Preparing sorting game...</Container>;
    }

    const firstTrack = optionsList[firstIdx];
    const secondTrack = optionsList[secondIdx];

    function handleChoice(which) {
        if (sortingIterations < 1) return;

        // Determine new index to compare next
        const maxInd = Math.max(firstIdx, secondIdx);
        const newOptionInd = maxInd + 1 <= sortingIterations ? maxInd + 1 : 0;

        const list = [...optionsList];
        if (which === 'first') {
            // if firstIdx > secondIdx, swap
            if (firstIdx > secondIdx) {
                [list[firstIdx], list[secondIdx]] = [list[secondIdx], list[firstIdx]];
                setSecondIdx(firstIdx);
            }
            if (newOptionInd === 0) {
                setFirstIdx(0);
                setSecondIdx(1);
                setSortingIterations(si => si - 1);
            } else {
                setFirstIdx(newOptionInd);
            }
        } else {
            // clicked second
            if (secondIdx > firstIdx) {
                [list[firstIdx], list[secondIdx]] = [list[secondIdx], list[firstIdx]];
                setFirstIdx(secondIdx);
            }
            if (newOptionInd === 0) {
                setFirstIdx(0);
                setSecondIdx(1);
                setSortingIterations(si => si - 1);
            } else {
                setSecondIdx(newOptionInd);
            }
        }

        setOptionsList(list);
        setBattleNum(bn => bn + 1);

        // Finish
        if (sortingIterations - 1 <= 0) {
            setRankedTracks(list);
            setSortingStack([]);
            navigate('/result');
        }
    }

    return (
        <Container>
            <h2>Which song do you prefer?</h2>
            <ProgressBar><ProgressFill style={{ width: `${progress}%` }} /></ProgressBar>
            <Button onClick={() => handleChoice('first')}>{firstTrack.name}</Button>
            <Button onClick={() => handleChoice('second')}>{secondTrack.name}</Button>
            <p style={{ marginTop: '1rem' }}>{progress}% sorted</p>
        </Container>
    );
}
