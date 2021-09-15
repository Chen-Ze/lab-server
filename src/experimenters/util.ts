/**
 * If any of the parameter is NaN, the generated array will be [stop].
 * @param start The starting value.
 * @param stop The stop value, always included.
 * @param step The step, the sign of which will be inverted if it does not match the sign of (stop - step).
 * @returns The array.
 */
export const linspace = (start: number, stop: number, step: number) => {
    if ((stop - start) * step <= 0) step = -step; // correct the sign of step
    const steps = Math.ceil((stop - start) / step);
    return [...Array.from({length: steps}, (_, i) => i).map(i => start + step * i), stop];
}


export const arrayDirectProduct = <S, T>(array1: S[], array2: T[]): [S[], T[]] => {
    return [
        Array(array2.length).fill(array1).reduce((x, y) => x.concat(y)),
        Array(array1.length).fill(array2).reduce((x, y) => x.concat(y))
    ]
}


export const zipArray = <S, T>(array1: S[], array2: T[]): [S, T][] => {
    return array1.map((x1, i): [S, T] => [x1, array2[i]]);
}


export const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));
