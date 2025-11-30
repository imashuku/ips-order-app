'use client';

import { useEffect, useState } from 'react';
import { OrderItem } from '@/hooks/useOrderCalculator';
import { Download } from 'lucide-react';

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
  const [isClient, setIsClient] = useState(false);
  const [PDFComponent, setPDFComponent] = useState<any>(null);

  useEffect(() => {
    // クライアントサイドでのみPDFライブラリを動的にインポート
    const loadPDF = async () => {
      try {
        const { PDFDownloadLink } = await import('@react-pdf/renderer');
        const { OrderPDF } = await import('./OrderPDF');
        
        setPDFComponent(() => ({ PDFDownloadLink, OrderPDF }));
        setIsClient(true);
      } catch (error) {
        console.error('PDF library loading failed:', error);
        setIsClient(true); // エラーでも表示は続ける
      }
    };

    loadPDF();
  }, []);

  if (!isClient || !PDFComponent) {
    return (
      <button className="flex items-center gap-2 bg-gray-300 text-white px-6 py-3 rounded-lg font-bold">
        読み込み中...
      </button>
    );
  }

  if (disabled) {
    return (
      <button disabled className="flex items-center gap-2 bg-gray-300 text-gray-500 px-6 py-3 rounded-lg cursor-not-allowed font-bold">
        <Download size={20} />
        PDFを作成
      </button>
    );
  }

  const { PDFDownloadLink, OrderPDF } = PDFComponent;

  return (
    <PDFDownloadLink
      document={
        <OrderPDF
          date={date}
          agentName={agentName}
          phoneNumber={phoneNumber}
          address={address}
          items={items}
          calculations={calculations}
        />
      }
      fileName={`発注書_${agentName}_${date}.pdf`}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
    >
      {/* @ts-ignore: render props pattern */}
      {({ blob, url, loading, error }) => {
        if (error) {
          return (
            <span className="text-red-500">
              <Download size={20} />
              エラーが発生しました
            </span>
          );
        }
        return loading ? 'PDFを準備中...' : (
          <>
            <Download size={20} />
            PDFをダウンロード
          </>
        );
      }}
    </PDFDownloadLink>
  );
};

export default PDFDownloadButton;
