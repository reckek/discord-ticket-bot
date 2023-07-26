export const normalizeTimeStamp = (milliseconds?: number) => Math.floor(milliseconds ?? Date.now() / 1000)
