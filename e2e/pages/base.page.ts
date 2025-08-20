import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string = '') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    // Disable animations/transitions to reduce flakiness in E2E
    await this.page.addStyleTag({
      content: '*,*::before,*::after{transition:none!important;animation:none!important;}',
    });
  }

  async waitForLoadState() {
    await this.page.waitForLoadState('networkidle');
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async screenshot(name: string) {
    await this.page.screenshot({ path: `./test-results/${name}.png` });
  }
}
