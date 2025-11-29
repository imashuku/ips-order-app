'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { products } from '@/data/products';
import { useOrderCalculator } from '@/hooks/useOrderCalculator';
import { ShoppingCart, User, Phone, MapPin, Calendar, Package, Info } from 'lucide-react';

// PDFダウンロードボタンを動的インポート (SSR回避)
const PDFDownloadButton = dynamic(() => import('@/components/PDFDownloadButton'), {
  ssr: false,
  loading: () => <button className="bg-gray-300 text-white px-6 py-3 rounded-lg">読み込み中...</button>,
});

export default function Home() {
  // 日付の初期値 (例: 7年11月29日)
  // 令和への変換簡易ロジック
  const today = new Date();
  const year = today.getFullYear();
  const reiwaYear = year - 2018;
  const initialDate = `${reiwaYear}年${today.getMonth() + 1}月${today.getDate()}日`;

  const [date, setDate] = useState(initialDate);
  const [agentName, setAgentName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  const {
    quantities,
    updateQuantity,
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
  } = useOrderCalculator();

  // カテゴリごとに商品をグループ化
  const cosmeticProducts = products.filter(p => p.category === 'cosmetics');
  const supplementProducts = products.filter(p => p.category === 'supplements');
  const promotionProducts = products.filter(p => p.category === 'promotion');

  const handleQuantityChange = (code: string, val: string) => {
    const num = parseInt(val, 10);
    updateQuantity(code, isNaN(num) ? 0 : num);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">代理店発注書作成アプリ</h1>
          <p className="mt-2 text-gray-600">必要な項目を入力してPDFを生成してください</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左カラム: 入力フォーム */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. 代理店情報 */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-500" />
                代理店情報
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">発注日</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">代理店名</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      placeholder="例: 木村 世里菜"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="例: 090-1234-5678"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">送り先住所</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="住所を入力してください"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 2. 商品入力 */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Package size={20} className="text-blue-500" />
                注文商品
              </h2>
              
              <div className="space-y-8">
                {/* 化粧品 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 border-b pb-2 border-blue-100">
                    化粧品 <span className="text-sm font-normal text-gray-500 ml-2">通常税率10%・掛率適用</span>
                  </h3>
                  <div className="space-y-2">
                    {cosmeticProducts.map((product) => (
                      <div key={product.code} data-testid={`product-${product.code}`} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded transition-colors">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{product.name}</div>
                          <div className="text-sm text-gray-500">¥{product.price.toLocaleString()}</div>
                        </div>
                        <div className="w-24">
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={quantities[product.code] || ''}
                            onChange={(e) => handleQuantityChange(product.code, e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-right"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 健康食品 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 border-b pb-2 border-green-100">
                    健康食品 <span className="text-sm font-normal text-gray-500 ml-2">軽減税率8%・掛率適用</span>
                  </h3>
                  <div className="space-y-2">
                    {supplementProducts.map((product) => (
                      <div key={product.code} data-testid={`product-${product.code}`} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded transition-colors">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{product.name}</div>
                          <div className="text-sm text-gray-500">¥{product.price.toLocaleString()}</div>
                        </div>
                        <div className="w-24">
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={quantities[product.code] || ''}
                            onChange={(e) => handleQuantityChange(product.code, e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-right"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 販促品 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3 border-b pb-2 border-orange-100">
                    販促品 <span className="text-sm font-normal text-gray-500 ml-2">税率10%・掛率なし</span>
                  </h3>
                  <div className="space-y-2">
                    {promotionProducts.map((product) => (
                      <div key={product.code} data-testid={`product-${product.code}`} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded transition-colors">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{product.name}</div>
                          <div className="text-sm text-gray-500">¥{product.price.toLocaleString()}</div>
                        </div>
                        <div className="w-24">
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={quantities[product.code] || ''}
                            onChange={(e) => handleQuantityChange(product.code, e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border text-right"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* 右カラム: 集計・アクション */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              
              {/* 集計カード */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ShoppingCart size={20} className="text-blue-500" />
                  注文内容確認
                </h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                     <span>商品合計点数</span>
                     <span className={totalQuantity < 6 ? "text-red-500 font-bold" : "text-gray-900"}>
                        {totalQuantity} 点
                        {totalQuantity < 6 && <span className="block text-xs text-red-500 text-right">※6点以上必要です</span>}
                     </span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between mb-1">
                      <span>化粧品(税込)</span>
                      <span>¥{taxedCosmetics.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>健康食品(税込)</span>
                      <span>¥{taxedSupplements.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-1 text-gray-500">
                      <span>販促品(税込)</span>
                      <span>¥{taxedPromotion.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="border-t pt-3 bg-gray-50 -mx-6 px-6 py-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">送料</span>
                      <span className={isShippingFree ? "text-green-600 font-bold" : "text-gray-900"}>
                        ¥{shippingFee.toLocaleString()}
                      </span>
                    </div>
                    {!isShippingFree && (
                       <div className="text-xs text-gray-500 text-right mb-2">
                         あと ¥{(120000 - totalRegularPrice).toLocaleString()} (税抜)で無料
                       </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="font-bold text-lg text-gray-900">合計金額</span>
                      <span className="font-bold text-2xl text-blue-600">¥{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                   <PDFDownloadButton 
                      date={date}
                      agentName={agentName}
                      phoneNumber={phoneNumber}
                      address={address}
                      items={items}
                      calculations={{
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
                        totalRegularPrice
                      }}
                      disabled={totalQuantity === 0}
                   />
                </div>
              </div>

              {/* インフォメーション */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                <div className="flex items-start gap-2">
                   <Info size={18} className="mt-0.5 flex-shrink-0" />
                   <div>
                     <p className="font-bold mb-1">重要なお知らせ</p>
                     <ul className="list-disc list-inside space-y-1 text-blue-700">
                       <li>商品個数が合計6個以上になるように発注してください。</li>
                       <li>定価(税抜)合計12万円以上の場合は送料無料になります。</li>
                     </ul>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
