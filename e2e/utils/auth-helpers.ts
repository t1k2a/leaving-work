import { Page } from '@playwright/test';

export async function authenticateUser(page: Page, password: string) {
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