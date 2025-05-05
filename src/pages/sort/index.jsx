import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
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

export default function SortPage({ sortingStack, setSortingStack, rankedTracks, setRankedTracks }) {
    const navigate = useNavigate();

    // internal algorithm state
    const lstMemberRef = useRef([]);
    const parentRef = useRef([]);
    const equalRef = useRef([]);
    const recRef = useRef([]);
    const cmp1Ref = useRef(0);
    const cmp2Ref = useRef(0);
    const head1Ref = useRef(0);
    const head2Ref = useRef(0);
    const nrecRef = useRef(0);
    const totalSizeRef = useRef(0);
    const finishSizeRef = useRef(0);

    // UI state for current matchup and progress
    const [currentPair, setCurrentPair] = useState([null, null]);
    const [progress, setProgress] = useState(0);

    // Initialize merge-sort tournament when tracks list changes
    useEffect(() => {
        const n = sortingStack.length;
        if (!Array.isArray(sortingStack) || n < 2) return;

        // Build full merge tree: lstMember holds arrays of indices
        const lstMember = [];
        const parent = [];
        let totalSize = 0;

        // Root sequence of all indices
        lstMember.push(Array.from({ length: n }, (_, i) => i));
        parent.push(-1);

        // Recursively split all sequences
        for (let i = 0; i < lstMember.length; i++) {
            const arr = lstMember[i];
            if (arr.length >= 2) {
                const mid = Math.ceil(arr.length / 2);
                const left = arr.slice(0, mid);
                const right = arr.slice(mid);
                lstMember.push(left); parent.push(i); totalSize += left.length;
                lstMember.push(right); parent.push(i); totalSize += right.length;
            }
        }

        // Prepare equal and rec arrays
        const equal = Array(n).fill(-1);
        const rec = Array(n).fill(0);

        // Store in refs
        lstMemberRef.current = lstMember;
        parentRef.current = parent;
        equalRef.current = equal;
        recRef.current = rec;
        cmp1Ref.current = lstMember.length - 2;
        cmp2Ref.current = lstMember.length - 1;
        head1Ref.current = 0;
        head2Ref.current = 0;
        nrecRef.current = 0;
        totalSizeRef.current = totalSize;
        finishSizeRef.current = 0;

        // Kick off first matchup
        nextBattle();
    }, [sortingStack]);

    // Show next pair or finalize
    function nextBattle() {
        const { current: lst } = lstMemberRef;
        const cmp1 = cmp1Ref.current;
        if (cmp1 < 0) {
            // Tournament complete
            const finalOrder = lst[0].map(i => sortingStack[i]);
            setRankedTracks(finalOrder);
            setSortingStack([]);
            navigate("/result");
            return;
        }

        // Update progress bar
        setProgress(Math.floor((finishSizeRef.current / totalSizeRef.current) * 100));

        // Determine current track indices
        const idx1 = lst[cmp1][head1Ref.current];
        const idx2 = lst[cmp2Ref.current][head2Ref.current];
        setCurrentPair([sortingStack[idx1], sortingStack[idx2]]);
    }

    // User choice: flag=-1 left, flag=0 tie, flag=1 right
    function handleChoice(flag) {
        const lst = lstMemberRef.current;
        const equal = equalRef.current;
        let rec = recRef.current;
        let nrec = nrecRef.current;

        const take = (listIdx, headRef) => {
            const arr = lst[listIdx];
            const h = headRef.current;
            rec[nrec++] = arr[h];
            headRef.current++;
            finishSizeRef.current++;
            // auto-include any equal-ranked items
            while (equal[rec[nrec - 1]] !== -1) {
                rec[nrec++] = arr[headRef.current++];
                finishSizeRef.current++;
            }
        };

        // merge logic
        if (flag <= 0) take(cmp1Ref.current, head1Ref);
        if (flag >= 0) {
            if (flag === 0) {
                // record tie mapping
                const lastRec = rec[nrec - 1];
                equal[lastRec] = lst[cmp2Ref.current][head2Ref.current];
            }
            take(cmp2Ref.current, head2Ref);
        }

        // flush any remainder
        const a1 = lst[cmp1Ref.current], a2 = lst[cmp2Ref.current];
        if (head1Ref.current < a1.length && head2Ref.current === a2.length) {
            while (head1Ref.current < a1.length) take(cmp1Ref.current, head1Ref);
        } else if (head2Ref.current < a2.length && head1Ref.current === a1.length) {
            while (head2Ref.current < a2.length) take(cmp2Ref.current, head2Ref);
        }

        // when both lists done merging, write back into parent
        if (head1Ref.current === a1.length && head2Ref.current === a2.length) {
            const parentIdx = parentRef.current[cmp1Ref.current];
            for (let k = 0; k < rec.length; k++) {
                lst[parentIdx][k] = rec[k];
            }
            lst.pop(); lst.pop();
            // move to previous pair
            cmp1Ref.current -= 2;
            cmp2Ref.current -= 2;
            head1Ref.current = 0;
            head2Ref.current = 0;
            recRef.current = Array(sortingStack.length).fill(0);
            nrecRef.current = 0;
        }

        recRef.current = rec;
        nrecRef.current = nrec;
        nextBattle();
    }

    const [left, right] = currentPair;
    if (!left || !right) {
        return <Container>Preparing matchup...</Container>;
    }

    return (
        <Container>
            <h2>Which song do you prefer?</h2>
            <ProgressBar><ProgressFill style={{ width: `${progress}%` }} /></ProgressBar>
            <Button onClick={() => handleChoice(-1)}>{left.name}</Button>
            <Button onClick={() => handleChoice(1)}>{right.name}</Button>
            <p style={{ marginTop: '1rem' }}>{progress}% sorted</p>
        </Container>
    );
}
