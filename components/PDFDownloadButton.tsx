'use client';

import { useEffect, useState, useMemo } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { OrderPDF } from './OrderPDF';
import { OrderItem } from '@/hooks/useOrderCalculator';
import { useDebounce } from '@/hooks/useDebounce';
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

  // PDF生成に必要なデータを遅延させる（入力のたびに再生成されるのを防ぐ）
  // 500msの間に入力がなければPDFを更新する
  const debouncedData = useDebounce({
    date,
    agentName,
    phoneNumber,
    address,
    items,
    calculations,
  }, 500);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // PDFドキュメント自体をメモ化する（不必要な再レンダリング防止）
  const pdfDocument = useMemo(() => (
    <OrderPDF
      date={debouncedData.date}
      agentName={debouncedData.agentName}
      phoneNumber={debouncedData.phoneNumber}
      address={debouncedData.address}
      items={debouncedData.items}
      calculations={debouncedData.calculations}
    />
  ), [debouncedData]);

  if (!isClient) {
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

  return (
    <PDFDownloadLink
      document={pdfDocument}
      fileName={`発注書_${agentName}_${date}.pdf`}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
    >
      {/* @ts-ignore: render props pattern */}
      {({ blob, url, loading, error }) =>
        loading ? 'PDFを準備中...' : (
          <>
            <Download size={20} />
            PDFをダウンロード
          </>
        )
      }
    </PDFDownloadLink>
  );
};

export default PDFDownloadButton;
