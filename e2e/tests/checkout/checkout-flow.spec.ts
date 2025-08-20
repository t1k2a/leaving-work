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
      process.env.AUTH_PASSWORD ?? 'jojine12',
    );
  });

  test('認証済みの場合チェックアウトボタンを表示する', async ({ page }) => {
    await checkoutPage.goto();
    expect(await checkoutPage.isCheckoutButtonEnabled()).toBe(true);
  });

  test('チェックアウトプロセスを正常に完了する', async ({ page }) => {
    await checkoutPage.goto();
    
    // Click checkout button
    expect(await checkoutPage.clickCheckoutButton()).toBe(true);
  });

});
