export function header(text: string, level: number) {
    return `${"#".repeat(level)} ${text}`;
}

export function getHeaderGenerator(initialLevel = 1) {
    return (text: string, level: number) => header(text, initialLevel + level - 1);
}
