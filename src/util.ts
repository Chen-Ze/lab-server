import randomWords from 'random-words';

export const getRandomId: (minLength?: number, exclude?: string[]) => string = (minLength: number = 1, exclude?: string[]) => {
    const generated = randomWords({ exactly: minLength, join: '-' });
    if (!exclude) return generated;
    if (exclude.indexOf(generated) < 0) return generated;
    return getRandomId(minLength + 1, exclude);
}