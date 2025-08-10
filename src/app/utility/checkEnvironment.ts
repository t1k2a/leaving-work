export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

export function isStg(): boolean {
    return process.env.VERCEL_ENV === 'preview';
}