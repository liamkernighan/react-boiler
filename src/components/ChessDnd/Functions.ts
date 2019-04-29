
export const canMoveKnight = (x: number, y: number) => {
    const [a, b] = [1, 7]; // knightPosition
    const dx = x - a;
    const dy = y - b;

    return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
        (Math.abs(dx) === 1 && Math.abs(dy) === 2);
}