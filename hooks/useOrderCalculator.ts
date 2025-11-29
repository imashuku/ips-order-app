import { useState, useMemo } from 'react';
import { products, Product } from '@/data/products';

export type OrderItem = Product & {
  quantity: number;
  subtotal: number;
};

export const useOrderCalculator = () => {
  // 商品コードをキー、数量を値とするマップ
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const updateQuantity = (code: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [code]: Math.max(0, quantity),
    }));
  };

  const orderSummary = useMemo(() => {
    // カテゴリごとの集計
    let sumCosmetics = 0; // 10% 掛率あり
    let sumSupplements = 0; // 8% 掛率あり
    let sumPromotion = 0; // 10% 掛率なし

    // 注文明細リスト
    const items: OrderItem[] = [];

    products.forEach((product) => {
      const qty = quantities[product.code] || 0;
      if (qty > 0) {
        const subtotal = product.price * qty;
        items.push({ ...product, quantity: qty, subtotal });

        if (product.isPromotion) {
          sumPromotion += subtotal;
        } else if (product.taxRate === 0.08) {
          sumSupplements += subtotal;
        } else {
          sumCosmetics += subtotal;
        }
      }
    });

    // 計算ロジック
    // 掛率
    const RATE = 0.65;
    
    // 1. 化粧品 (10%, 掛率あり)
    const discountedCosmetics = Math.floor(sumCosmetics * RATE);
    const taxedCosmetics = Math.floor(discountedCosmetics * 1.10);

    // 2. 健康食品 (8%, 掛率あり)
    const discountedSupplements = Math.floor(sumSupplements * RATE);
    const taxedSupplements = Math.floor(discountedSupplements * 1.08);

    // 3. 販促品 (10%, 掛率なし)
    const taxedPromotion = Math.floor(sumPromotion * 1.10);

    // 4. 送料判定
    // 定価合計(税抜)が12万円以上で無料
    // 対象は「この枠の商品」＝通常商品（化粧品＋健康食品）と思われる
    const totalRegularPrice = sumCosmetics + sumSupplements;
    const isShippingFree = totalRegularPrice >= 120000;
    const shippingFee = isShippingFree ? 0 : 1100; // 税込1100円

    // 総合計
    const grandTotal = taxedCosmetics + taxedSupplements + taxedPromotion + shippingFee;

    // 商品合計個数（送料無料判定の上の注意書き「合計6個以上になるように」用）
    const totalQuantity = Object.values(quantities).reduce((a, b) => a + b, 0);

    return {
      items,
      sumCosmetics,
      sumSupplements,
      sumPromotion,
      discountedCosmetics,
      taxedCosmetics,
      discountedSupplements,
      taxedSupplements,
      taxedPromotion,
      isShippingFree,
      shippingFee,
      grandTotal,
      totalQuantity,
      totalRegularPrice,
    };
  }, [quantities]);

  return {
    quantities,
    updateQuantity,
    ...orderSummary,
  };
};

