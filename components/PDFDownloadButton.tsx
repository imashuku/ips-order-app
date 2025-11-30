'use client';

import { useState } from 'react';
import { OrderItem } from '@/hooks/useOrderCalculator';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

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
    
    try {
      const doc = new jsPDF();
      let y = 20;

      // タイトル
      doc.setFontSize(16);
      doc.text('発注書', 105, y, { align: 'center' });
      y += 15;

      // 代理店情報
      doc.setFontSize(12);
      doc.text(`発注日: ${date}`, 20, y);
      y += 8;
      doc.text(`代理店名: ${agentName}`, 20, y);
      y += 8;
      doc.text(`電話番号: ${phoneNumber}`, 20, y);
      y += 8;
      doc.text(`送り先住所: ${address}`, 20, y);
      y += 15;

      // 注文内容
      doc.setFontSize(14);
      doc.text('注文内容', 20, y);
      y += 10;

      doc.setFontSize(10);
      items.forEach((item) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(`${item.name} (${item.code})`, 20, y);
        doc.text(`数量: ${item.quantity}`, 120, y);
        doc.text(`小計: ¥${item.subtotal.toLocaleString()}`, 160, y);
        y += 7;
      });

      y += 10;

      // 合計
      doc.setFontSize(12);
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.text('===================================', 20, y);
      y += 8;
      doc.text(`化粧品(税込): ¥${calculations.taxedCosmetics.toLocaleString()}`, 20, y);
      y += 7;
      doc.text(`健康食品(税込): ¥${calculations.taxedSupplements.toLocaleString()}`, 20, y);
      y += 7;
      doc.text(`販促品(税込): ¥${calculations.taxedPromotion.toLocaleString()}`, 20, y);
      y += 7;
      doc.text(`送料: ¥${calculations.shippingFee.toLocaleString()}`, 20, y);
      y += 10;
      doc.setFontSize(14);
      doc.text(`合計金額: ¥${calculations.grandTotal.toLocaleString()}`, 20, y);

      // PDFダウンロード
      doc.save(`発注書_${agentName}_${date}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDFの生成に失敗しました。');
    } finally {
      setIsGenerating(false);
    }
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
      <Download size={20} />
      {isGenerating ? 'PDF作成中...' : 'PDFをダウンロード'}
    </button>
  );
};

export default PDFDownloadButton;
