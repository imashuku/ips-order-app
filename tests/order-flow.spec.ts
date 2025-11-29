import { test, expect } from '@playwright/test';

test('代理店発注書の作成フロー', async ({ page }) => {
  // ページを開く
  await page.goto('/');

  // ページタイトルと見出しの確認
  await expect(page.getByRole('heading', { name: '代理店発注書作成アプリ' })).toBeVisible();

  // 1. 代理店情報の入力
  await page.getByPlaceholder('例: 木村 世里菜').fill('テスト 太郎');
  await page.getByPlaceholder('例: 090-1234-5678').fill('090-1111-2222');
  await page.getByPlaceholder('住所を入力してください').fill('東京都新宿区1-1-1');

  // 2. 商品の注文
  // data-testidを使って確実に入力
  
  // 化粧品: PP3コンディショニングバー (code: 103)
  await page.getByTestId('product-103').getByRole('spinbutton').fill('4');

  // 健康食品: ピュレット ワン (code: 301)
  await page.getByTestId('product-301').getByRole('spinbutton').fill('2');
  
  // 販促品: 領収書 (code: 838)
  await page.getByTestId('product-838').getByRole('spinbutton').fill('1');

  // 3. 計算結果の検証
  // 合計点数: 4 + 2 + 1 = 7点
  await expect(page.getByText('7 点')).toBeVisible();

  // 金額計算の検証
  await expect(page.locator('body')).toContainText('化粧品(税込)');
  await expect(page.locator('body')).toContainText('¥10,010');

  await expect(page.locator('body')).toContainText('健康食品(税込)');
  await expect(page.locator('body')).toContainText('¥16,848');

  await expect(page.locator('body')).toContainText('販促品(税込)');
  await expect(page.locator('body')).toContainText('¥330');

  await expect(page.locator('body')).toContainText('送料');
  await expect(page.locator('body')).toContainText('¥1,100');
  
  await expect(page.locator('body')).toContainText('合計金額');
  await expect(page.locator('body')).toContainText('¥28,288');

  // 4. 送料無料ラインのテスト
  // PP1エッセンス (code: 101) を 10個追加 = 120,000円
  await page.getByTestId('product-101').getByRole('spinbutton').fill('10');

  // 送料が0円になることを確認
  await expect(page.locator('span.text-green-600', { hasText: '¥0' })).toBeVisible();

  // 5. PDFダウンロードボタンの確認
  const downloadButton = page.getByRole('link', { name: 'PDFをダウンロード' });
  await expect(downloadButton).toBeVisible();
  await expect(downloadButton).not.toBeDisabled();
});
