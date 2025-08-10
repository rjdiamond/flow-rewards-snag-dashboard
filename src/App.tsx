import './App.css';  
import DailyTxAndWalletsChart from './components/DailyTxAndWalletsChart';

function App() {
  return (
    <div style={{
      marginTop: '2rem',
      marginBottom: '2rem',
      minHeight: '100vh, 2000px',
      minWidth: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflowX: 'hidden',
    }}>
      <div style={{
        
        width: 'min(1600vh, 1800px)',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 2px 16px #eee',
        background: '#f6f8fa',
      }}>
        <h1 style={{ textAlign: 'center', color: '#010c16ff', fontFamily: 'Arial, sans-serif', marginBottom: '1rem' }}>Flow Rewards Dashboard</h1>
        <DailyTxAndWalletsChart  />
      </div>
    </div>
  );
}

export default App
