export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

export function isStg(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }
    
    const url = window.location.href;
    
    return url.includes('development') && !url.includes('localhost');
}