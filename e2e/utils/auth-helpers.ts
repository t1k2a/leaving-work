import { Page } from '@playwright/test';

export async function authenticateUser(page: Page, password: string) {
  // すでに認証済みなら早期リターン
  const session = await page.request.get('/api/auth/session').then(r => r.json())
  if (session?.user) return
  
  // グローバル設定でログインしているため、下記は不要になるかもしれない
  await page.goto('/api/auth/signin');
  await page.fill('#password', password);
  await page.getByRole('button', { name: 'ログイン' }).click();
  await page.waitForURL('/', { waitUntil: 'networkidle' });
}

export async function logout(page: Page) {
  await page.goto('/api/auth/signout');
  await page.getByRole('button', { name: /sign out/i }).click();
  await page.waitForURL('/', { waitUntil: 'networkidle' });
}

export async function isAuthenticated(page: Page): Promise<boolean> {
  const response = await page.request.get('/api/auth/session');
  const session = await response.json();
  return session && session.user !== null;
}