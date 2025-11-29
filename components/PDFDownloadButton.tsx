'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { OrderPDF } from './OrderPDF';
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
      {({ blob, url, loading, error }) =>
        loading ? 'PDFを作成中...' : (
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

