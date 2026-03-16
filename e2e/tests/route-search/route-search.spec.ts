import { test, expect } from '@playwright/test';

test.describe('経路検索機能テスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test.describe('API呼び出しの検証', () => {
    test('トップページアクセス時に経路検索APIが呼び出される', async ({ page }) => {
      const routeRequest = await page.waitForResponse(
        (response) => response.url().includes('/api/route-search') && response.status() === 200,
      );
      const data = await routeRequest.json();
      expect(data).toHaveProperty('route');
      expect(data).toHaveProperty('origin', '阪東橋駅');
      expect(data).toHaveProperty('destination', '綱島駅');
      expect(data).toHaveProperty('timestamp');
    });
  });

  test.describe('ボタンの状態', () => {
    test('読み込み完了後に「経路を表示」ボタンが表示される', async ({ page }) => {
      // API応答を待つ
      await page.waitForResponse(
        (response) => response.url().includes('/api/route-search'),
      );
      const button = page.getByRole('button', { name: '経路を表示' });
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
    });
  });

  test.describe('モーダル表示/非表示', () => {
    test('「経路を表示」ボタンクリックでモーダルが表示される', async ({ page }) => {
      await page.waitForResponse(
        (response) => response.url().includes('/api/route-search'),
      );
      await page.getByRole('button', { name: '経路を表示' }).click();

      await expect(page.getByRole('heading', { name: '経路検索結果' })).toBeVisible();
    });

    test('閉じるボタンでモーダルが非表示になる', async ({ page }) => {
      await page.waitForResponse(
        (response) => response.url().includes('/api/route-search'),
      );
      await page.getByRole('button', { name: '経路を表示' }).click();
      await expect(page.getByRole('heading', { name: '経路検索結果' })).toBeVisible();

      // 閉じるボタン（×）をクリック
      await page.getByRole('button', { name: '\u00d7' }).click();
      await expect(page.getByRole('heading', { name: '経路検索結果' })).not.toBeVisible();
    });
  });

  test.describe('経路情報の表示内容', () => {
    test('E2Eテスト用ダミー経路情報が正しく表示される', async ({ page }) => {
      await page.waitForResponse(
        (response) => response.url().includes('/api/route-search'),
      );
      await page.getByRole('button', { name: '経路を表示' }).click();

      // E2E_FAKE_LLM=1の場合のダミーデータが表示されることを確認
      const modal = page.locator('[class*="modal"]');
      await expect(modal).toBeVisible();
      await expect(modal.getByText('阪東橋駅')).toBeVisible();
      await expect(modal.getByText('綱島駅')).toBeVisible();
    });
  });

  test.describe('エラーケース', () => {
    test('API失敗時にエラーメッセージが表示される', async ({ page }) => {
      // APIをモックして失敗させる
      await page.route('**/api/route-search', (route) => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' }),
        });
      });

      await page.goto('/', { waitUntil: 'domcontentloaded' });

      // エラー状態でもボタンが表示されることを待つ
      const button = page.getByRole('button', { name: '経路を表示' });
      await expect(button).toBeVisible({ timeout: 10000 });

      await button.click();

      // モーダル内にエラーメッセージが表示される
      await expect(page.getByText('経路情報の取得に失敗しました')).toBeVisible();
    });
  });
});
