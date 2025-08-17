import { test, expect } from '@playwright/test';

// 認証はライブラリの責務。ここでは「自アプリの結合部のみ」スモーク検証する。
test.describe('認証スモーク', () => {
  // 未認証: 保護ページにアクセスするとサインインへリダイレクト
  test.describe('未認証', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('保護ページはサインインへ遷移する', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(/\/auth\/signin(?:\?.*)?$/);
    });
  });

  // 認証済み: 保護ページにアクセスできる（storageState は globalSetup で作成済み）
  test.describe('認証済み', () => {
    test('保護ページを表示できる', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('button', { name: 'ログアウト' })).toBeVisible();
    });

    test('ログアウトでサインインへ戻る', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const logoutButton = page.getByRole('button', { name: 'ログアウト' });
      await expect(logoutButton).toBeVisible();
      await logoutButton.click();
      await expect(page).toHaveURL(/\/auth\/signin(?:\?.*)?$/);
    });
  });
});
