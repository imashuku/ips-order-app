'use client';

import { useState } from 'react';
import { OrderItem } from '@/hooks/useOrderCalculator';
import { Download, Printer } from 'lucide-react';

type Props = {
  date: string;
  agentName: string;
  phoneNumber: string;
  address: string;
  items: OrderItem[];
  calculations: any;
  disabled: boolean;
};

const PDFDownloadButton = ({ date, agentName, phoneNumber, address, items, calculations, disabled }: Props) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = () => {
    setIsGenerating(true);
    
    // 新しいウィンドウで印刷用ページを開く
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('ポップアップがブロックされました。ブラウザの設定を確認してください。');
      setIsGenerating(false);
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>発注書_${agentName}_${date}</title>
        <style>
          @media print {
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
          
          body {
            font-family: 'MS PGothic', 'Hiragino Kaku Gothic Pro', 'Meiryo', sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          
          h1 {
            text-align: center;
            font-size: 24px;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
          
          .info-section {
            margin-bottom: 30px;
            line-height: 1.8;
          }
          
          .info-section div {
            margin-bottom: 8px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          
          th, td {
            border: 1px solid #333;
            padding: 8px;
            text-align: left;
          }
          
          th {
            background-color: #f0f0f0;
            font-weight: bold;
          }
          
          .text-right {
            text-align: right;
          }
          
          .summary {
            margin-top: 30px;
            padding: 20px;
            border: 2px solid #333;
            background-color: #f9f9f9;
          }
          
          .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
          }
          
          .summary-total {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px solid #333;
            font-size: 18px;
            font-weight: bold;
          }
          
          .no-print {
            text-align: center;
            margin: 20px 0;
          }
          
          @media print {
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <h1>発注書</h1>
        
        <div class="info-section">
          <div><strong>発注日:</strong> ${date}</div>
          <div><strong>代理店名:</strong> ${agentName}</div>
          <div><strong>電話番号:</strong> ${phoneNumber}</div>
          <div><strong>送り先住所:</strong> ${address}</div>
        </div>
        
        <h2>注文内容</h2>
        <table>
          <thead>
            <tr>
              <th>商品コード</th>
              <th>商品名</th>
              <th class="text-right">単価</th>
              <th class="text-right">数量</th>
              <th class="text-right">小計</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td>${item.code || '-'}</td>
                <td>${item.name}</td>
                <td class="text-right">¥${item.price.toLocaleString()}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">¥${item.subtotal.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="summary">
          <div class="summary-row">
            <span>化粧品(税込):</span>
            <span>¥${calculations.taxedCosmetics.toLocaleString()}</span>
          </div>
          <div class="summary-row">
            <span>健康食品(税込):</span>
            <span>¥${calculations.taxedSupplements.toLocaleString()}</span>
          </div>
          <div class="summary-row">
            <span>販促品(税込):</span>
            <span>¥${calculations.taxedPromotion.toLocaleString()}</span>
          </div>
          <div class="summary-row">
            <span>送料:</span>
            <span>¥${calculations.shippingFee.toLocaleString()}</span>
          </div>
          <div class="summary-total">
            <span>合計金額:</span>
            <span>¥${calculations.grandTotal.toLocaleString()}</span>
          </div>
        </div>
        
        <div class="no-print">
          <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; cursor: pointer; background-color: #3b82f6; color: white; border: none; border-radius: 5px; margin-right: 10px;">
            印刷 / PDF保存
          </button>
          <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; cursor: pointer; background-color: #6b7280; color: white; border: none; border-radius: 5px;">
            閉じる
          </button>
        </div>
        
        <script>
          // ページ読み込み後、自動で印刷ダイアログを開く
          window.onload = function() {
            setTimeout(() => {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setIsGenerating(false);
  };

  if (disabled) {
    return (
      <button disabled className="flex items-center gap-2 bg-gray-300 text-gray-500 px-6 py-3 rounded-lg cursor-not-allowed font-bold">
        <Download size={20} />
        PDFを作成
      </button>
    );
  }

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:bg-gray-400"
    >
      <Printer size={20} />
      {isGenerating ? 'PDF作成中...' : 'PDFをダウンロード'}
    </button>
  );
};

export default PDFDownloadButton;
