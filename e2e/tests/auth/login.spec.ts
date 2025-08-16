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
    // NextAuth APIエンドポイントのリクエストを監視
    const apiCalls: string[] = [];
    
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('api/auth/')) {
        apiCalls.push(new URL(url).pathname);
      }
    });

    await loginPage.goto();
    await loginPage.loginWithCredentials(
      process.env.AUTH_PASSWORD || 'jojine12'
    );
    
    // NextAuthの認証フローが正しい順序で実行されることを確認
    expect(apiCalls).toContain('/api/auth/providers');
    expect(apiCalls).toContain('/api/auth/csrf');
    expect(apiCalls).toContain('/api/auth/callback/credentials');
    
    // 最終的にホームページにリダイレクトされることを確認
    await page.waitForURL('http://localhost:3000/', { waitUntil: 'networkidle' });
    expect(page.url()).toBe('http://localhost:3000/');
    
    // ログアウトボタンが表示されることを確認（ログイン成功の証）
    await page.waitForSelector('button:has-text("ログアウト")', { timeout: 5000 });
    expect(await homePage.isLogoutButtonVisible()).toBe(true);
  });

  test('無効な認証情報でエラーメッセージを表示する', async ({ page }) => {
    await loginPage.goto();
    await loginPage.loginWithCredentials('wrongpassword');
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('ページリロード後もセッションを維持する', async ({ page, context }) => {
    await loginPage.goto();
    await loginPage.loginWithCredentials(
      process.env.AUTH_PASSWORD || 'jojine12'
    );
    
    await page.reload();
    expect(await homePage.isLogoutButtonVisible()).toBe(true);
  });

  test('ログアウトに成功する', async ({ page }) => {
    await loginPage.goto();
    await loginPage.loginWithCredentials(
     process.env.AUTH_PASSWORD || 'jojine12'
    );
    // アプリのログアウトボタンからログアウト（NextAuthの確認ページを経由しない）
    await expect(page.getByRole('button', { name: 'ログアウト' })).toBeVisible();
    await page.getByRole('button', { name: 'ログアウト' }).click();
    // ホームは未ログイン時に即サインインへリダイレクトされるため、
    // サインインページへの遷移とフォーム表示で検証する
    // 実装はカスタムページ `/auth/signin` にリダイレクトするため、URLパターンを修正
    await expect(page).toHaveURL(/\/auth\/signin/);
    await expect(page.locator('#password')).toBeVisible();
  });
});
