import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home.page';
import { LoginPage } from '../../pages/login.page';

test.describe('認証テスト', () => {
  let homePage: HomePage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
  });


  // test('should redirect to login page when clicking login button', async ({ page }) => {
  //   await homePage.goto();
  //   // await homePage.clickLoginButton();
  //   expect(await loginPage.isOnLoginPage()).toBe(true);
  // });

  test('有効な認証情報でログインに成功する', async ({ page }) => {
    // 内部API呼び出し順序は実装依存で変動するため監視しない

    await loginPage.goto();
    await loginPage.loginWithCredentials(
      process.env.AUTH_PASSWORD || 'jojine12'
    );
    
    // 最終的にホームページにリダイレクトされることを確認
    await page.waitForURL('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    expect(page.url()).toBe('http://localhost:3000/');
    
    // ログアウトボタンが表示されることを確認（ログイン成功の証）
    await page.waitForSelector('button:has-text("ログアウト")', { timeout: 5000 });
    expect(await homePage.isLogoutButtonVisible()).toBe(true);
  });

  test('無効な認証情報でエラーメッセージを表示する', async ({ page }) => {
    await loginPage.goto();
    await loginPage.loginWithCredentials('wrongpassword');
    
    // 非同期レンダーに備えて、エラーメッセージの可視を待つ
    await expect(page.getByText('パスワードが正しくありません')).toBeVisible();
  });

  test('ページリロード後もセッションを維持する', async ({ page, context }) => {
    await loginPage.goto();
    await loginPage.loginWithCredentials(
      process.env.AUTH_PASSWORD || 'jojine12'
    );

    // まずはホームの描画完了を待つ
    await page.waitForURL('http://localhost:3000/', { waitUntil: 'domcontentloaded'});
    const logoutButton = page.getByRole('button', { name: 'ログアウト' });
    await expect(logoutButton).toBeVisible();

    // リロードも安定化してから検証
    await page.reload({ waitUntil: 'domcontentloaded'});
    // リロード直後は `status === "loading"` により一時的に「読み込み中...」が表示されるため、
    // ログアウトボタンの可視性をロケータで待って検証する（自動待機を活用）
    await expect(page.getByRole('button', { name: 'ログアウト' })).toBeVisible();
  });

  test('ログアウトに成功する', async ({ page }) => {
    await loginPage.goto();
    await loginPage.loginWithCredentials(
     process.env.AUTH_PASSWORD || 'jojine12'
    );
    
    // ログイン直後にページ準備完了を待つ
    await page.waitForURL('http://localhost:3000/', {waitUntil: 'domcontentloaded'})

    const logoutButton = page.getByRole('button', {name: 'ログアウト'});
    await expect(logoutButton).toBeVisible();
    await logoutButton.click()
    // ログアウト後の遷移を明示的に検証
  await expect(page).toHaveURL(/\/auth\/signin/);
    await expect(page.locator('#password')).toBeVisible();
  });
});
