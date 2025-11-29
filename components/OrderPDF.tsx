'use client';

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { OrderItem } from '@/hooks/useOrderCalculator';

// 日本語フォントの登録
// 確実に日本語を表示するために、Githubなどで公開されているIPAexゴシックなどのURLを使用するか、
// Google FontsのURLを指定します。ここではNoto Sans JPを使用します。
Font.register({
  family: 'NotoSansJP',
  src: 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.ttf',
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'NotoSansJP',
    fontSize: 9,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: 18,
    alignItems: 'center',
  },
  tableColCode: { width: '10%', borderRightWidth: 1, borderRightColor: '#000', padding: 2 },
  tableColName: { width: '40%', borderRightWidth: 1, borderRightColor: '#000', padding: 2 },
  tableColPrice: { width: '15%', borderRightWidth: 1, borderRightColor: '#000', padding: 2, textAlign: 'right' },
  tableColQty: { width: '10%', borderRightWidth: 1, borderRightColor: '#000', padding: 2, textAlign: 'center' },
  tableColTotal: { width: '25%', padding: 2, textAlign: 'right' },
  
  // 特別なレイアウト用
  summaryBox: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    marginTop: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  textRight: {
    textAlign: 'right',
  },
  center: {
    textAlign: 'center',
  },
});

type OrderPDFProps = {
  date: string;
  agentName: string;
  phoneNumber: string;
  address: string;
  items: OrderItem[];
  calculations: {
    sumCosmetics: number;
    sumSupplements: number;
    sumPromotion: number;
    discountedCosmetics: number;
    taxedCosmetics: number;
    discountedSupplements: number;
    taxedSupplements: number;
    taxedPromotion: number;
    isShippingFree: boolean;
    shippingFee: number;
    grandTotal: number;
    totalRegularPrice: number;
  };
};

export const OrderPDF = ({
  date,
  agentName,
  phoneNumber,
  address,
  items,
  calculations,
}: OrderPDFProps) => {
  // 商品リストをカテゴリごとに分ける
  const cosmetics = items.filter(i => i.category === 'cosmetics');
  const supplements = items.filter(i => i.category === 'supplements');
  const promotions = items.filter(i => i.category === 'promotion');

  // 空行を埋めるためのヘルパー
  const renderEmptyRows = (currentCount: number, maxCount: number) => {
    const rows = [];
    for (let i = 0; i < maxCount - currentCount; i++) {
      rows.push(
        <View style={styles.tableRow} key={`empty-${i}`}>
          <Text style={styles.tableColCode}></Text>
          <Text style={styles.tableColName}></Text>
          <Text style={styles.tableColPrice}></Text>
          <Text style={styles.tableColQty}></Text>
          <Text style={styles.tableColTotal}></Text>
        </View>
      );
    }
    return rows;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.title}>IPS販社 地球 代理店発注書</Text>
          <View style={{ flexDirection: 'row' }}>
             <Text>発注日: {date}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <Text style={{ width: 60 }}>代理店名:</Text>
          <Text style={{ borderBottomWidth: 1, width: 200 }}>{agentName}</Text>
          <Text style={{ width: 60, marginLeft: 20 }}>お電話番号:</Text>
          <Text style={{ borderBottomWidth: 1, width: 150 }}>{phoneNumber}</Text>
        </View>
        
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <Text style={{ width: 60 }}>送り先住所:</Text>
          <Text style={{ borderBottomWidth: 1, flex: 1 }}>{address}</Text>
        </View>

        {/* 注意書き */}
        <View style={{ borderWidth: 1, padding: 2, marginBottom: 5, alignItems: 'center' }}>
          <Text>☆この枠の商品の個数が合計 6個以上 になるように発注してください☆</Text>
          <Text>☆この枠のご注文で定価(税抜)合計12万円以上の場合は送料無料になります☆</Text>
        </View>

        {/* 商品テーブル (化粧品・健康食品) */}
        <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
           {/* 左側: 化粧品 (10%) */}
           <View style={{ width: '50%', borderRightWidth: 1 }}>
              <View style={[styles.tableRow, { backgroundColor: '#eee' }]}>
                <Text style={styles.tableColCode}>コード</Text>
                <Text style={styles.tableColName}>商品名【10%】</Text>
                <Text style={styles.tableColPrice}>定価</Text>
                <Text style={styles.tableColQty}>個数</Text>
                <Text style={styles.tableColTotal}>定価合計</Text>
              </View>
              {cosmetics.map((item) => (
                <View style={styles.tableRow} key={item.code}>
                  <Text style={styles.tableColCode}>{item.code}</Text>
                  <Text style={styles.tableColName}>{item.name}</Text>
                  <Text style={styles.tableColPrice}>{item.price.toLocaleString()}</Text>
                  <Text style={styles.tableColQty}>{item.quantity}</Text>
                  <Text style={styles.tableColTotal}>{item.subtotal.toLocaleString()}</Text>
                </View>
              ))}
              {renderEmptyRows(cosmetics.length, 10)}
              
              <View style={styles.tableRow}>
                <Text style={{ flex: 1, textAlign: 'right', padding: 2 }}>定価合計(税抜)</Text>
                <Text style={{ width: '25%', textAlign: 'right', padding: 2 }}>{calculations.sumCosmetics.toLocaleString()} 円</Text>
              </View>
              <View style={{ flexDirection: 'row', borderBottomWidth: 1, padding: 2 }}>
                <Text style={{ flex: 1 }}>今月の掛率 65%</Text>
              </View>
              <View style={{ flexDirection: 'row', padding: 2 }}>
                <Text style={{ flex: 1 }}>掛率適用金額(税抜)</Text>
                <Text style={{ flex: 1 }}>税込金額(10%) ①</Text>
              </View>
               <View style={{ flexDirection: 'row', padding: 2 }}>
                <Text style={{ flex: 1, textAlign: 'right' }}>{calculations.discountedCosmetics.toLocaleString()} 円</Text>
                <Text style={{ flex: 1, textAlign: 'right', fontWeight: 'bold', fontSize: 11 }}>{calculations.taxedCosmetics.toLocaleString()}</Text>
              </View>
           </View>

           {/* 右側: 健康食品 (8%) */}
           <View style={{ width: '50%' }}>
              <View style={[styles.tableRow, { backgroundColor: '#eee' }]}>
                <Text style={styles.tableColCode}>コード</Text>
                <Text style={styles.tableColName}>商品名【8%】</Text>
                <Text style={styles.tableColPrice}>定価</Text>
                <Text style={styles.tableColQty}>個数</Text>
                <Text style={styles.tableColTotal}>定価合計</Text>
              </View>
               {supplements.map((item) => (
                <View style={styles.tableRow} key={item.code}>
                  <Text style={styles.tableColCode}>{item.code}</Text>
                  <Text style={styles.tableColName}>{item.name}</Text>
                  <Text style={styles.tableColPrice}>{item.price.toLocaleString()}</Text>
                  <Text style={styles.tableColQty}>{item.quantity}</Text>
                  <Text style={styles.tableColTotal}>{item.subtotal.toLocaleString()}</Text>
                </View>
              ))}
              {renderEmptyRows(supplements.length, 10)}

               <View style={styles.tableRow}>
                <Text style={{ flex: 1, textAlign: 'right', padding: 2 }}>定価合計(税抜)</Text>
                <Text style={{ width: '25%', textAlign: 'right', padding: 2 }}>{calculations.sumSupplements.toLocaleString()} 円</Text>
              </View>
               <View style={{ flexDirection: 'row', borderBottomWidth: 1, padding: 2 }}>
                <Text style={{ flex: 1 }}>今月の掛率 65%</Text>
              </View>
              <View style={{ flexDirection: 'row', padding: 2 }}>
                <Text style={{ flex: 1 }}>掛率適用金額(税抜)</Text>
                <Text style={{ flex: 1 }}>税込金額(8%) ②</Text>
              </View>
               <View style={{ flexDirection: 'row', padding: 2 }}>
                <Text style={{ flex: 1, textAlign: 'right' }}>{calculations.discountedSupplements.toLocaleString()} 円</Text>
                <Text style={{ flex: 1, textAlign: 'right', fontWeight: 'bold', fontSize: 11 }}>{calculations.taxedSupplements.toLocaleString()}</Text>
              </View>
           </View>
        </View>

        {/* 販促品 */}
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
           <View style={{ width: '50%', borderRightWidth: 1, borderTopWidth: 1, borderLeftWidth: 1, borderBottomWidth: 1 }}>
              <View style={[styles.tableRow, { backgroundColor: '#eee' }]}>
                <Text style={styles.tableColCode}>コード</Text>
                <Text style={styles.tableColName}>販促品【10%】</Text>
                <Text style={styles.tableColPrice}>定価</Text>
                <Text style={styles.tableColQty}>個数</Text>
                <Text style={styles.tableColTotal}>定価合計</Text>
              </View>
               {promotions.map((item) => (
                <View style={styles.tableRow} key={item.code}>
                  <Text style={styles.tableColCode}>{item.code}</Text>
                  <Text style={styles.tableColName}>{item.name}</Text>
                  <Text style={styles.tableColPrice}>{item.price.toLocaleString()}</Text>
                  <Text style={styles.tableColQty}>{item.quantity}</Text>
                  <Text style={styles.tableColTotal}>{item.subtotal.toLocaleString()}</Text>
                </View>
              ))}
              {renderEmptyRows(promotions.length, 5)}

              <View style={styles.tableRow}>
                <Text style={{ flex: 1, textAlign: 'right', padding: 2 }}>定価合計(税抜)</Text>
                <Text style={{ width: '25%', textAlign: 'right', padding: 2 }}>{calculations.sumPromotion.toLocaleString()} 円</Text>
              </View>
               <View style={{ flexDirection: 'row', padding: 2 }}>
                <Text style={{ flex: 1 }}>※販促品は掛率が適用されません</Text>
                <Text style={{ flex: 1 }}>税込金額(10%) ③</Text>
                <Text style={{ width: '25%', textAlign: 'right' }}>{calculations.taxedPromotion.toLocaleString()} 円</Text>
              </View>
           </View>
           
           {/* 右側：集計欄 */}
           <View style={{ width: '50%', paddingLeft: 10 }}>
              <View style={{ borderWidth: 1, padding: 5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text>①</Text>
                  <Text>{calculations.taxedCosmetics.toLocaleString()} 円</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}><Text>+</Text></View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text>②</Text>
                  <Text>{calculations.taxedSupplements.toLocaleString()} 円</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}><Text>+</Text></View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text>③</Text>
                  <Text>{calculations.taxedPromotion.toLocaleString()} 円</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}><Text>+</Text></View>
                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, borderBottomWidth: 1 }}>
                  <Text>税込送料</Text>
                  <Text>{calculations.shippingFee.toLocaleString()} 円</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}><Text>=</Text></View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold' }}>④ 税込総合計金額</Text>
                  <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{calculations.grandTotal.toLocaleString()} 円</Text>
                </View>
              </View>
           </View>
        </View>

        {/* 振込先情報 */}
        <View style={{ marginTop: 20, borderTopWidth: 1, paddingTop: 10 }}>
           <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>※④の総合計金額を下記振込先にお振込ください</Text>
           <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, padding: 5 }}>
                <Text>【銀行振込】</Text>
                <Text>ゆうちょ銀行</Text>
                <Text>四六八(ヨンロクハチ)支店</Text>
                <Text>貯蓄預金 2563574</Text>
                <Text>矢嶋知克(ヤジマチカ)</Text>
                
                <Text style={{ marginTop: 5 }}>【郵便振込】</Text>
                <Text>記号 14640</Text>
                <Text>番号 25635741</Text>
                <Text>矢嶋知克</Text>
              </View>
              <View style={{ flex: 1, padding: 5, borderLeftWidth: 1 }}>
                 <Text>【ご注文FAX番号】</Text>
                 <Text style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 5 }}>077-532-1062</Text>
                 <Text>お電話でのお問い合わせは</Text>
                 <Text>090-5047-0058 (ヤジマ)</Text>
              </View>
           </View>
        </View>
      </Page>
    </Document>
  );
};

