import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Removed unused formatDate

const DailyTxAndWalletsChart: React.FC = () => {
  const [txData, setTxData] = useState<any>(null);
  const [walletData, setWalletData] = useState<any>(null);
  const [weekWalletData, setWeekWalletData] = useState<any>(null);
  const [monthWalletData, setMonthWalletData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  // Removed unused days state
  // ...existing code...

  useEffect(() => {
  fetch('/wallet_summary.xlsx')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load XLSX');
        return response.arrayBuffer();
      })
      .then(arrayBuffer => {
        try {
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const sheet = workbook.Sheets['Daily Summary'];
          if (!sheet) throw new Error('Sheet "Daily Summary" not found');
          const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          // Find header row
          const headerRow = json.find(row => Array.isArray(row) && (row as string[]).includes('Date')) as string[] | undefined;
          if (!headerRow) throw new Error('Header row not found');
          const dateIdx = headerRow.indexOf('Date');
          const walletsIdx = headerRow.indexOf('Unique Wallets Per Day');
          const txsIdx = headerRow.indexOf('Transaction Count Per Day');
          if (dateIdx === -1 || walletsIdx === -1 || txsIdx === -1) throw new Error('Required columns not found');
          // Extract data rows
          const dataRows = json.filter(row => Array.isArray(row) && typeof (row as any[])[dateIdx] === 'string' && row !== headerRow) as any[][];
          const daysArr: string[] = [];
          const walletsArr: number[] = [];
          const txsArr: number[] = [];
          dataRows.forEach(row => {
            daysArr.push(row[dateIdx]);
            walletsArr.push(Number(row[walletsIdx]) || 0);
            txsArr.push(Number(row[txsIdx]) || 0);
          });
          // Removed erroneous setDays call
          // Removed unused state setters
          setTxData({
            labels: daysArr,
            datasets: [
              {
                label: 'Transaction Count Per Day',
                data: txsArr,
                borderColor: '#509EE3',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.3,
              },
            ],
          });
          setWalletData({
            labels: daysArr,
            datasets: [
              {
                label: 'Unique Wallets Per Day',
                data: walletsArr,
                borderColor: '#F2A86F',
                backgroundColor: 'rgba(242, 168, 111, 0.2)',
                fill: true,
                tension: 0.3,
              },
            ],
          });
          // Weekly Unique Wallets
          const weekSheet = workbook.Sheets['Weekly Unique Wallets'];
          if (weekSheet) {
            const weekJson = XLSX.utils.sheet_to_json(weekSheet, { header: 1 });
            const weekHeader = weekJson.find(row => Array.isArray(row) && (row as string[]).includes('Week')) as string[] | undefined;
            if (weekHeader) {
              const weekIdx = weekHeader.indexOf('Week');
              const walletsIdx = weekHeader.indexOf('Unique Wallets Per Week');
              const weekRows = weekJson.filter(row => Array.isArray(row) && typeof (row as any[])[weekIdx] === 'string' && row !== weekHeader) as any[][];
              const weekArr: string[] = [];
              const weekWalletsArr: number[] = [];
              weekRows.forEach(row => {
                weekArr.push(row[weekIdx]);
                weekWalletsArr.push(Number(row[walletsIdx]) || 0);
              });
              setWeekWalletData({
                labels: weekArr,
                datasets: [
                  {
                    label: 'Unique Wallets Per Week',
                    data: weekWalletsArr,
                    borderColor: '#7D5FFF',
                    backgroundColor: 'rgba(125, 95, 255, 0.2)',
                    fill: true,
                    tension: 0.3,
                  },
                ],
              });
            }
          }
          // Monthly Unique Wallets
          const monthSheet = workbook.Sheets['Monthly Unique Wallets'];
          if (monthSheet) {
            const monthJson = XLSX.utils.sheet_to_json(monthSheet, { header: 1 });
            const monthHeader = monthJson.find(row => Array.isArray(row) && (row as string[]).includes('Month')) as string[] | undefined;
            if (monthHeader) {
              const monthIdx = monthHeader.indexOf('Month');
              const walletsIdx = monthHeader.indexOf('Unique Wallets Per Month');
              const monthRows = monthJson.filter(row => Array.isArray(row) && typeof (row as any[])[monthIdx] === 'string' && row !== monthHeader) as any[][];
              const monthArr: string[] = [];
              const monthWalletsArr: number[] = [];
              monthRows.forEach(row => {
                monthArr.push(row[monthIdx]);
                monthWalletsArr.push(Number(row[walletsIdx]) || 0);
              });
              setMonthWalletData({
                labels: monthArr,
                datasets: [
                  {
                    label: 'Unique Wallets Per Month',
                    data: monthWalletsArr,
                    borderColor: '#00C896',
                    backgroundColor: 'rgba(0, 200, 150, 0.2)',
                    fill: true,
                    tension: 0.3,
                  },
                ],
              });
            }
          }
          setError(null);
        } catch (err: any) {
          setError('Error parsing XLSX: ' + err.message);
        }
      })
      .catch(() => setError('Could not load XLSX from /wallet_summary.xlsx'));
  }, []);

  // No wallet grouping needed for XLSX version

  return (
    <>
      {/* Big numbers row, outside chart box */}
      <div style={{
        width: 1600,
        display: 'flex',
        gap: '2rem',
        margin: '2rem auto 0 auto',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        maxWidth: '100%',
      }}>
        {/* Unique Wallets Per Day big number card for all data */}
        <div style={{
          flex: 1,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 1px 3px #F2A86F',
          border: '2px solid #F2A86F',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem 0',
        }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#3a3a3aff', marginBottom: 4 }}>Unique Wallets (Overtime)</span>
          <span style={{ fontWeight: 800, fontSize: 50, color: '#F2A86F', lineHeight: 1, letterSpacing: '-2px', marginBottom: 8 }}>
            {walletData?.datasets?.[0]?.data?.reduce((a: number, b: number) => a + b, 0).toLocaleString()}
          </span>
            <span style={{ fontWeight: 500, fontSize: 10, color: '#3a3a3aff', marginBottom: 2 }}>(04-16-2025 - 08-10-2025)</span>
        </div>
        {/* Transaction Count Per Day big number card for all data */}
        <div style={{
          flex: 1,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 1px 3px #509EE3',
          border: '2px solid #509EE3',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem 0',
        }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#3a3a3aff', marginBottom: 4 }}>Transaction Count (Overtime)</span>
          <span style={{ fontWeight: 800, fontSize: 50, color: '#509EE3', lineHeight: 1, letterSpacing: '-2px', marginBottom: 8 }}>
            {txData?.datasets?.[0]?.data?.reduce((a: number, b: number) => a + b, 0).toLocaleString()}
          </span>
            <span style={{ fontWeight: 500, fontSize: 10, color: '#3a3a3aff', marginBottom: 2 }}>04-16-2025 - 08-10-2025</span>
        </div>
      </div>
      {/* Chart box below big numbers */}
      {/* Transaction Count Per Day chart in its own box above all wallet charts */}
      <div style={{
        width: 1600,
        minHeight: 400,
        margin: '2rem auto',
        padding: '2rem',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 1px 3px #509EE3',
        border: '2px solid #509EE3',
        fontFamily: 'Lato, Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: '2rem',
        overflow: 'hidden',
        position: 'relative',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, color: '#213547', marginBottom: '0.5rem' }}>Transactions Per Day</h2>
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
        <div style={{ width: '100%' }}>
          {txData && (
            <div style={{ width: '100%', height: 350 }}>
              <Line
                data={txData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Day',
                        font: { family: 'Lato, Arial, sans-serif', weight: 'bold', size: 14 },
                        color: '#213547',
                      },
                      grid: { color: '#EEECEC', borderDash: [5, 5] } as any,
                      ticks: { font: { family: 'Lato, Arial, sans-serif', size: 12, weight: 'bold' }, color: '#4C5773' },
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Transactions',
                        font: { family: 'Lato, Arial, sans-serif', weight: 'bold', size: 14 },
                        color: '#213547',
                      },
                      grid: { color: '#EEECEC', borderDash: [5, 5] } as any,
                      ticks: { font: { family: 'Lato, Arial, sans-serif', size: 12, weight: 'bold' }, color: '#4C5773' },
                      beginAtZero: true,
                    },
                  },
                  elements: {
                    line: { borderWidth: 3, borderJoinStyle: 'round', borderColor: '#509EE3' },
                    point: { radius: 4, backgroundColor: '#509EE3', borderColor: '#fff', borderWidth: 2 },
                  },
                }}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          )}
        </div>
      </div>
      {/* Wallet charts below */}
      <div style={{
        width: 1600,
        minHeight: 400,
        margin: '2rem auto',
        padding: '2rem',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 1px 3px #509EE3',
        border: '2px solid #509EE3',
        fontFamily: 'Lato, Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: '2rem',
        overflow: 'hidden',
        position: 'relative',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, color: '#213547', marginBottom: '0.5rem' }}>Daily Unique Wallets</h2>
        {/* Unique Wallets Per Day chart */}
        <div style={{ width: '100%', marginBottom: '2rem' }}>
          {walletData && (
            <div style={{ width: '100%', height: 350 }}>
              <Line
                data={walletData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Day',
                        font: { family: 'Lato, Arial, sans-serif', weight: 'bold', size: 14 },
                        color: '#213547',
                      },
                      grid: { color: '#EEECEC', borderDash: [5, 5] } as any,
                      ticks: { font: { family: 'Lato, Arial, sans-serif', size: 12, weight: 'bold' }, color: '#4C5773' },
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Unique Wallets',
                        font: { family: 'Lato, Arial, sans-serif', weight: 'bold', size: 14 },
                        color: '#213547',
                      },
                      grid: { color: '#EEECEC', borderDash: [5, 5] } as any,
                      ticks: { font: { family: 'Lato, Arial, sans-serif', size: 12, weight: 'bold' }, color: '#4C5773' },
                      beginAtZero: true,
                    },
                  },
                  elements: {
                    line: { borderWidth: 3, borderJoinStyle: 'round', borderColor: '#F2A86F' },
                    point: { radius: 4, backgroundColor: '#F2A86F', borderColor: '#fff', borderWidth: 2 },
                  },
                }}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          )}
        </div>
        {/* Weekly Unique Wallets chart */}
        <h2 style={{ fontWeight: 700, fontSize: 22, color: '#213547', margin: '2rem 0 0.5rem 0' }}>Weekly Unique Wallets</h2>
        <div style={{ width: '100%' }}>
          {weekWalletData && (
            <div style={{ width: '100%', height: 350 }}>
              <Line
                data={weekWalletData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Week',
                        font: { family: 'Lato, Arial, sans-serif', weight: 'bold', size: 14 },
                        color: '#213547',
                      },
                      grid: { color: '#EEECEC', borderDash: [5, 5] } as any,
                      ticks: { font: { family: 'Lato, Arial, sans-serif', size: 12, weight: 'bold' }, color: '#4C5773' },
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Unique Wallets',
                        font: { family: 'Lato, Arial, sans-serif', weight: 'bold', size: 14 },
                        color: '#213547',
                      },
                      grid: { color: '#EEECEC', borderDash: [5, 5] } as any,
                      ticks: { font: { family: 'Lato, Arial, sans-serif', size: 12, weight: 'bold' }, color: '#4C5773' },
                      beginAtZero: true,
                    },
                  },
                  elements: {
                    line: { borderWidth: 3, borderJoinStyle: 'round', borderColor: '#7D5FFF' },
                    point: { radius: 4, backgroundColor: '#7D5FFF', borderColor: '#fff', borderWidth: 2 },
                  },
                }}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          )}
        </div>
        {/* Monthly Unique Wallets chart */}
        <h2 style={{ fontWeight: 700, fontSize: 22, color: '#213547', margin: '2rem 0 0.5rem 0' }}>Monthly Unique Wallets</h2>
        <div style={{ width: '100%' }}>
          {monthWalletData && (
            <div style={{ width: '100%', height: 350 }}>
              <Line
                data={monthWalletData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Month',
                        font: { family: 'Lato, Arial, sans-serif', weight: 'bold', size: 14 },
                        color: '#213547',
                      },
                      grid: { color: '#EEECEC', borderDash: [5, 5] } as any,
                      ticks: { font: { family: 'Lato, Arial, sans-serif', size: 12, weight: 'bold' }, color: '#4C5773' },
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Unique Wallets',
                        font: { family: 'Lato, Arial, sans-serif', weight: 'bold', size: 14 },
                        color: '#213547',
                      },
                      grid: { color: '#EEECEC', borderDash: [5, 5] } as any,
                      ticks: { font: { family: 'Lato, Arial, sans-serif', size: 12, weight: 'bold' }, color: '#4C5773' },
                      beginAtZero: true,
                    },
                  },
                  elements: {
                    line: { borderWidth: 3, borderJoinStyle: 'round', borderColor: '#00C896' },
                    point: { radius: 4, backgroundColor: '#00C896', borderColor: '#fff', borderWidth: 2 },
                  },
                }}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          )}
        </div>
      </div>
    </>
   
  );
};

export default DailyTxAndWalletsChart;
// Removed unused setDays function

