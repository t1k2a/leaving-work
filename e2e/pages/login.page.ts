import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    // カスタムサインインページへ直接遷移
    await super.goto('/auth/signin');
  }

  async loginWithCredentials(password: string) {
    // サインインフォームの準備が整うまで待機
    await this.page.waitForLoadState('domcontentloaded');

    // パスワード入力フィールドを取得（IDを優先）
    const passwordInput = this.page.locator('#password');
    
    // パスワードフィールドが存在するか確認
    const count = await passwordInput.count();
    if (count === 0) {
      console.log('Password input not found. Page HTML:');
      console.log(await this.page.content());
      throw new Error('Password input field not found');
    }
    
    // パスワードを入力
    await passwordInput.waitFor({ state: 'visible', timeout: 30000 });
    await passwordInput.fill(password);
    
    // サインインボタンを探す（日本語UIを優先、フォールバック含む）
    const signInButton = this.page
      .locator('button:has-text("ログイン"), input[type="submit"], button[type="submit" ]')
      .first();
    
    await signInButton.waitFor({ state: 'visible', timeout: 10000 });
    await signInButton.click();
    
    // 成否により挙動が異なるため、ここでは固定のURL待機はしない。
    // 成功時: 呼び出し側のテストで `toHaveURL('/')` 等を検証
    // 失敗時: 呼び出し側のテストでエラーメッセージ可視を検証
  }

  async loginWithGoogle() {
    await this.page.getByRole('button', { name: /sign in with google/i }).click();
  }

  async getErrorMessage(): Promise<string | null> {
    // 日本語メッセージにマッチ or エラークラスにマッチ（CSS Modulesでも拾えるように部分一致）
    const errorByText = this.page.getByText('パスワードが正しくありません', { exact: false });
    if (await errorByText.isVisible().catch(() => false)) {
      return await errorByText.textContent();
    }
    const errorByClass = this.page.locator('[class*="error"]');
    if (await errorByClass.first().isVisible().catch(() => false)) {
      return await errorByClass.first().textContent();
    }
    return null;
  }

  async isOnLoginPage(): Promise<boolean> {
    return this.page.url().includes('/auth/signin');
  }
}
