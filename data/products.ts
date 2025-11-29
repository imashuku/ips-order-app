export type Product = {
  code: string;
  name: string;
  price: number;
  taxRate: 0.1 | 0.08;
  category: 'cosmetics' | 'supplements' | 'promotion';
  isPromotion?: boolean;
};

export const products: Product[] = [
  // 化粧品・定価 (10%)
  { code: '101', name: 'PP1エッセンス', price: 12000, taxRate: 0.1, category: 'cosmetics' },
  { code: '102', name: 'PP2エッセンスジェル', price: 10000, taxRate: 0.1, category: 'cosmetics' },
  { code: '103', name: 'PP3コンディショニングバー', price: 3500, taxRate: 0.1, category: 'cosmetics' },
  { code: '104', name: 'PP4シャンプー', price: 4300, taxRate: 0.1, category: 'cosmetics' },
  { code: '105', name: 'PP5トリートメント', price: 4300, taxRate: 0.1, category: 'cosmetics' },
  { code: '111', name: 'PP6エッセンスUV', price: 6000, taxRate: 0.1, category: 'cosmetics' },
  { code: '107', name: 'PP7ナイトクリーム', price: 10000, taxRate: 0.1, category: 'cosmetics' },
  { code: '108', name: '8プレミアム', price: 24000, taxRate: 0.1, category: 'cosmetics' },
  { code: '112', name: 'PP9育毛エッセンス', price: 8000, taxRate: 0.1, category: 'cosmetics' },
  { code: '113', name: 'エッセンスマスク(30枚入り)', price: 5000, taxRate: 0.1, category: 'cosmetics' },

  // 健康食品・定価 (8%)
  { code: '301', name: 'ピュレット ワン', price: 12000, taxRate: 0.08, category: 'supplements' },
  { code: '306', name: 'ピュレット ツー', price: 10000, taxRate: 0.08, category: 'supplements' },

  // 販促品 (10%, 掛率適用外)
  { code: '839', name: '納品書(連鎖販売取引用)', price: 300, taxRate: 0.1, category: 'promotion', isPromotion: true },
  { code: '840', name: '納品書(BU一般用)', price: 300, taxRate: 0.1, category: 'promotion', isPromotion: true },
  { code: '838', name: '領収書', price: 300, taxRate: 0.1, category: 'promotion', isPromotion: true },
  { code: '835', name: 'PSビューティー会員登録書・定期購入セット(5部)', price: 500, taxRate: 0.1, category: 'promotion', isPromotion: true },
  { code: '836', name: 'PSプレミアム会員登録・概要書面(5部)', price: 2500, taxRate: 0.1, category: 'promotion', isPromotion: true },
  { code: '834', name: 'PS代理店資格申請書・内容確認書(10部)', price: 120, taxRate: 0.1, category: 'promotion', isPromotion: true },
  { code: '702', name: 'CBケース', price: 300, taxRate: 0.1, category: 'promotion', isPromotion: true },
  { code: '735', name: 'CBケース トラベル', price: 600, taxRate: 0.1, category: 'promotion', isPromotion: true },
  { code: '', name: '名刺台紙(100枚)', price: 500, taxRate: 0.1, category: 'promotion', isPromotion: true },
  { code: '735-2', name: '泡立てネット', price: 300, taxRate: 0.1, category: 'promotion', isPromotion: true },
];

