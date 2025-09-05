export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

export function isStg(): boolean {
  if (typeof window === 'undefined') {
    return process.env.VERCEL_ENV === 'preview';
  }

  const publicEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;
  if (publicEnv) {
    return publicEnv === 'preview';
  }

  if (process.env.VERCEL_ENV) {
    return process.env.VERCEL_ENV === 'preview';
  }

  const host = window.location.host;
  const isVercelDomain = /\.vercel\.app$/i.test(host);
  const looksLikePreviewSubdomain = host.includes('-git-');
  const isLocalhost = /localhost(:\d+)?$/.test(host);
  return !isLocalhost && isVercelDomain && looksLikePreviewSubdomain;
}
