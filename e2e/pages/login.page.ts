import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/api/auth/signin');
  }

  async loginWithCredentials(password: string) {
    // ページが完全に読み込まれるまで待機
    await this.page.waitForLoadState('networkidle');
    
    // デバッグ: ページのHTMLを出力
    console.log('Current URL:', this.page.url());
    console.log('Page title:', await this.page.title());
    
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
    
    // サインインボタンを探す（複数のパターンを試す）
    const signInButton = await this.page.locator('button:has-text("Sign in"), button:has-text("サインイン"), input[type="submit"], button[type="submit"]').first();
    
    await signInButton.waitFor({ state: 'visible', timeout: 10000 });
    await signInButton.click();
    
    // URLの変更を待機
    await this.page.waitForURL('/', { waitUntil: 'networkidle', timeout: 30000 });
  }

  async loginWithGoogle() {
    await this.page.getByRole('button', { name: /sign in with google/i }).click();
  }

  async getErrorMessage(): Promise<string | null> {
    const errorElement = this.page.locator('.error-message');
    if (await errorElement.isVisible()) {
      return await errorElement.textContent();
    }
    return null;
  }

  async isOnLoginPage(): Promise<boolean> {
    return this.page.url().includes('/api/auth/signin');
  }
}