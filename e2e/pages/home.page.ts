import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/');
  }

  async isLoginButtonVisible(): Promise<boolean> {
    return await this.page.getByRole('button', { name: /sign in/i }).isVisible();
  }

  async clickLoginButton() {
    await this.page.getByRole('button', { name: /sign in/i }).click();
  }

  async getWelcomeMessage(): Promise<string | null> {
    const welcomeElement = this.page.locator('text=/Welcome/');
    if (await welcomeElement.isVisible()) {
      return await welcomeElement.textContent();
    }
    return null;
  }

  async isUserMenuVisible(): Promise<boolean> {
    return await this.page.locator('[data-testid="user-menu"]').isVisible();
  }

  async isLogoutButtonVisible(): Promise<boolean> {
    return await this.page.getByRole('button', { name: 'ログアウト' }).isVisible();
  }
}