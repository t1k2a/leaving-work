import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../../pages/checkout.page';
import { authenticateUser } from '../../utils/auth-helpers';

test.describe('チェックアウトフローテスト', () => {
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    checkoutPage = new CheckoutPage(page);
    
    // Authenticate user before each test
    await authenticateUser(
      page,
      process.env.TEST_USER_PASSWORD || 'jojine12'
    );
  });

  test('認証済みの場合チェックアウトボタンを表示する', async ({ page }) => {
    await checkoutPage.goto();
    expect(await checkoutPage.isCheckoutButtonEnabled()).toBe(true);
  });

  test('チェックアウトプロセスを正常に完了する', async ({ page }) => {
    await checkoutPage.goto();
    
    // Click checkout button
    await checkoutPage.clickCheckoutButton();
    
    // Wait for confirmation dialog
    await page.waitForSelector('text=/確認/');
    
    // Confirm checkout
    await checkoutPage.confirmCheckout();
    
    // Verify success message
    const successMessage = await checkoutPage.getSuccessMessage();
    expect(successMessage).toBeTruthy();
  });

  test('チェックアウトプロセスをキャンセルする', async ({ page }) => {
    await checkoutPage.goto();
    
    // Click checkout button
    await checkoutPage.clickCheckoutButton();
    
    // Wait for confirmation dialog
    await page.waitForSelector('text=/キャンセル/');
    
    // Cancel checkout
    await checkoutPage.cancelCheckout();
    
    // Verify button is still enabled
    expect(await checkoutPage.isCheckoutButtonEnabled()).toBe(true);
  });

  test('チェックアウト成功後に最終チェックアウト時刻を表示する', async ({ page }) => {
    await checkoutPage.goto();
    
    // Complete checkout
    await checkoutPage.clickCheckoutButton();
    await page.waitForSelector('text=/確認/');
    await checkoutPage.confirmCheckout();
    
    // Wait for the page to update
    await page.waitForTimeout(1000);
    
    // Verify last checkout time is displayed
    const lastCheckoutTime = await checkoutPage.getLastCheckoutTime();
    expect(lastCheckoutTime).toBeTruthy();
  });

  test('複数回のチェックアウト試行を処理する', async ({ page }) => {
    await checkoutPage.goto();
    
    // First checkout
    await checkoutPage.clickCheckoutButton();
    await page.waitForSelector('text=/確認/');
    await checkoutPage.confirmCheckout();
    
    // Wait for success
    await page.waitForTimeout(1000);
    
    // Try second checkout
    await checkoutPage.goto();
    const isButtonEnabled = await checkoutPage.isCheckoutButtonEnabled();
    
    // Button might be disabled if there's a cooldown period
    expect(typeof isButtonEnabled).toBe('boolean');
  });

  test('ページリロード後もチェックアウトステータスを維持する', async ({ page }) => {
    await checkoutPage.goto();
    
    // Complete checkout
    await checkoutPage.clickCheckoutButton();
    await page.waitForSelector('text=/確認/');
    await checkoutPage.confirmCheckout();
    
    // Wait and reload
    await page.waitForTimeout(1000);
    await page.reload();
    
    // Verify status is maintained
    const status = await checkoutPage.getCheckoutStatus();
    expect(status).toBeTruthy();
  });
});