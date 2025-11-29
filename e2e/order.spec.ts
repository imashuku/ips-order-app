import { test, expect } from '@playwright/test';

test('注文書作成フローのE2Eテスト', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // 代理店情報の入力
  await page.getByPlaceholder('例: 木村 世里菜').fill('テスト代理店');
  await page.getByPlaceholder('例: 090-1234-5678').fill('090-1234-5678');
  await page.getByPlaceholder('住所を入力してください').fill('滋賀県東近江市小脇町1972番');

  // 商品入力
  // data-testidを使用して確実に入力要素を特定する
  
  // PP3コンディショニングバー (4個) code: 103
  await page.locator('[data-testid="product-103"] input[type="number"]').fill('4');

  // PP4シャンプー (2個) code: 104
  await page.locator('[data-testid="product-104"] input[type="number"]').fill('2');

  // PP5トリートメント (2個) code: 105
  // 行自体をスクロールしてからinputを操作する
  const pp5Row = page.locator('[data-testid="product-105"]');
  await pp5Row.scrollIntoViewIfNeeded();
  await pp5Row.locator('input[type="number"]').fill('2');

  // 泡立てネット (3個) code: 735-2
  const netRow = page.locator('[data-testid="product-735-2"]');
  await netRow.scrollIntoViewIfNeeded();
  await netRow.locator('input[type="number"]').fill('3');

  // 検証
  await expect(page.getByText('11 点')).toBeVisible();
  await expect(page.getByText('¥1,100', { exact: true })).toBeVisible();
  await expect(page.getByText('¥23,298')).toBeVisible();
});
