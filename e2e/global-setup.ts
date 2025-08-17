import { chromium, type FullConfig } from '@playwright/test'
import fs from 'fs';

export default async function globalSetup(config: FullConfig) {
    const baseURL = (config.projects[0].use?.baseURL as string) ?? 'http://localhost:3000/';
    console.log(baseURL)
    fs.mkdirSync('e2e/.auth', { recursive: true });

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto(`${baseURL}/auth/signin`, { waitUntil: 'domcontentloaded' });
    await page.fill('#password', process.env.AUTH_PASSWORD ?? 'jojine12');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await page.waitForURL(`${baseURL}`, { waitUntil: 'domcontentloaded' });

    await context.storageState({ path: 'e2e/.auth/user.json' });
    await browser.close();
}