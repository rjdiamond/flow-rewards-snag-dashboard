import React, { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
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
    fetch(import.meta.env.BASE_URL + 'wallet_summary.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load JSON');
        return response.json();
      })
      .then(data => {
        try {
          // Daily Summary
          const daily = data['Daily Summary'] || [];
          const daysArr: string[] = [];
          const walletsArr: number[] = [];
          const txsArr: number[] = [];
          daily.forEach((row: any) => {
            daysArr.push(row['Date']);
            walletsArr.push(Number(row['Unique Wallets Per Day']) || 0);
            txsArr.push(Number(row['Transaction Count Per Day']) || 0);
          });
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
          const weekly = data['Weekly Unique Wallets'] || [];
          const weekArr: string[] = [];
          const weekWalletsArr: number[] = [];
          weekly.forEach((row: any) => {
            weekArr.push(row['Week']);
            weekWalletsArr.push(Number(row['Unique Wallets Per Week']) || 0);
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
          // Monthly Unique Wallets
          const monthly = data['Monthly Unique Wallets'] || [];
          const monthArr: string[] = [];
          const monthWalletsArr: number[] = [];
          monthly.forEach((row: any) => {
            monthArr.push(row['Month']);
            monthWalletsArr.push(Number(row['Unique Wallets Per Month']) || 0);
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
          setError(null);
        } catch (err: any) {
          setError('Error parsing JSON: ' + err.message);
        }
      })
      .catch(() => setError('Could not load JSON from ' + import.meta.env.BASE_URL + 'wallet_summary.json'));
  }, []);

  // No wallet grouping needed for XLSX version

  return (
    <>
      {/* Big numbers row, outside chart box */}
      <div
        style={{
          width: '100%',
          maxWidth: 1600,
          display: 'flex',
          flexDirection: 'row',
          gap: '2rem',
          margin: '2rem auto 0 auto',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
        }}
        className="big-numbers-row"
      >
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
      <div
        style={{
          width: '100%',
          maxWidth: 1600,
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
          boxSizing: 'border-box',
        }}
        className="chart-box"
      >
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
      <div
        style={{
          width: '100%',
          maxWidth: 1600,
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
          boxSizing: 'border-box',
        }}
        className="chart-box"
      >
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

