import { Page, expect } from '@playwright/test';
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
    // 既ログインならログイン処理をスキップ
    try {
      const session = await this.page.request
        .get('/api/auth/session')
        .then((r) => r.json())
        .catch(() => null as any);
      if (session?.user) return;
    } catch {}

    // サインインフォームの出現 or ホームへのリダイレクト完了のどちらかを待つ
    const passwordInput = this.page.locator('#password');

    const outcome = await Promise.race([
      passwordInput.waitFor({ state: 'visible', timeout: 8000 }).then(() => 'form' as const),
      this.page.waitForURL('**/', { waitUntil: 'domcontentloaded', timeout: 8000 }).then(() => 'home' as const),
    ]).catch(() => 'form' as const); // フォームを前提に続行（環境によりURL待機が先に解決しない場合に備え）

    if (outcome === 'home') {
      // 既にホームへリダイレクト済み（認証済み）
      return;
    }

    // フォームが見えている場合は入力して送信
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill(password);

    const signInButton = this.page
      .locator('button:has-text("ログイン"), input[type="submit"], button[type="submit" ]')
      .first();
    await expect(signInButton).toBeVisible();
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
