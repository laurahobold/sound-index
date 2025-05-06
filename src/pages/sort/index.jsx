import styled from "styled-components";
import {useState, useEffect, useCallback} from "react";
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
    const arr = [...array]; let m = arr.length;
    while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
}

export default function SortPage({ sortingStack, setSortingStack, setRankedTracks }) {
    const navigate = useNavigate();
    const n = Array.isArray(sortingStack) ? sortingStack.length : 0;

    // insertion-sort style state
    const [optionsList, setOptionsList] = useState([]);
    const [remaining, setRemaining] = useState(0);
    const [battleNum, setBattleNum] = useState(1);
    const [firstIdx, setFirstIdx] = useState(0);
    const [secondIdx, setSecondIdx] = useState(1);

    // total number of pairwise comparisons
    const totalBattles = n > 1 ? (n * (n - 1)) / 2 : 0;
    const progress = totalBattles > 0 ? Math.round(((battleNum - 1) * 100) / totalBattles) : 100;
    const initialize = useCallback(() => {
        if (n > 1) {
            const shuffled = shuffle(sortingStack);
            setOptionsList(shuffled);
            setRemaining(shuffled.length - 1);
            setBattleNum(1);
            setFirstIdx(0);
            setSecondIdx(1);
        }
    }, [sortingStack, n]);
    // initialize on mount
    useEffect(() => {
        if (n > 1) {
            const shuffled = shuffle(sortingStack);
            setOptionsList(shuffled);
            setRemaining(shuffled.length - 1);
            setBattleNum(1);
            setFirstIdx(0);
            setSecondIdx(1);
        }
    }, [sortingStack, n]);

    // guard loading
    if (optionsList.length < 2) {
        return <Container>Preparing sorting game...</Container>;
    }

    const a = optionsList[firstIdx];
    const b = optionsList[secondIdx];
    if (!a || !b) {
        return <Container>Preparing matchup...</Container>;
    }

    function handleChoice(isFirst) {
        if (remaining <= 0) return;
        const list = [...optionsList];
        let rem = remaining;
        const max = Math.max(firstIdx, secondIdx);
        const newInd = max + 1 <= rem ? max + 1 : 0;

        if (isFirst) {
            // swap if out of order
            if (firstIdx > secondIdx) {
                [list[firstIdx], list[secondIdx]] = [list[secondIdx], list[firstIdx]];
                setSecondIdx(firstIdx);
            }
            if (newInd === 0) {
                setFirstIdx(0);
                setSecondIdx(1);
                rem--;
            } else {
                setFirstIdx(newInd);
            }
        } else {
            if (secondIdx > firstIdx) {
                [list[firstIdx], list[secondIdx]] = [list[secondIdx], list[firstIdx]];
                setFirstIdx(secondIdx);
            }
            if (newInd === 0) {
                setFirstIdx(0);
                setSecondIdx(1);
                rem--;
            } else {
                setSecondIdx(newInd);
            }
        }

        setOptionsList(list);
        setRemaining(rem);
        setBattleNum((b) => b + 1);

        if (rem <= 0) {
            setRankedTracks(list);
            setSortingStack([]);
            navigate("/result");
        }
    }

    return (
        <Container>
            <h2>Which song do you prefer?</h2>
            <ProgressBar><ProgressFill style={{ width: `${progress}%` }} /></ProgressBar>
            <Button onClick={() => handleChoice(true)}>{a.name}</Button>
            <Button onClick={() => handleChoice(false)}>{b.name}</Button>
            <div>
                <Button onClick={initialize}>Restart</Button>

            </div>
            <p style={{ marginTop: '1rem' }}>{progress}% sorted</p>
        </Container>
    );
}
