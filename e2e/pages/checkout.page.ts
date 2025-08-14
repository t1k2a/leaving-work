import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/');
  }

  async selectUser(userId: string = '1') {
    await this.page.locator(`input[type="radio"][data-user-id="${userId}"]`).click();
  }

  async clickCheckoutButton() {
    await this.page.getByRole('button', { name: /退勤/i }).click();
  }

  async getCheckoutStatus(): Promise<string | null> {
    const statusElement = this.page.locator('[data-testid="checkout-status"]');
    if (await statusElement.isVisible()) {
      return await statusElement.textContent();
    }
    return null;
  }

  async isCheckoutButtonEnabled(): Promise<boolean> {
    // ユーザー選択のラジオボタンをクリック（data-user-id="1"を使用）
    await this.page.locator('input[type="radio"][data-user-id="1"]').click();
    const button = this.page.getByRole('button', { name: /退勤する/i });
    return await button.isEnabled();
  }

  async getLastCheckoutTime(): Promise<string | null> {
    const timeElement = this.page.locator('[data-testid="last-checkout-time"]');
    if (await timeElement.isVisible()) {
      return await timeElement.textContent();
    }
    return null;
  }

  async confirmCheckout() {
    await this.page.getByRole('button', { name: /確認/i }).click();
  }

  async cancelCheckout() {
    await this.page.getByRole('button', { name: /キャンセル/i }).click();
  }

  async getSuccessMessage(): Promise<string | null> {
    const successElement = this.page.locator('.success-message');
    if (await successElement.isVisible()) {
      return await successElement.textContent();
    }
    return null;
  }
}