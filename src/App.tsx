import { BrowserRouter } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import AppShell from './components/layout/AppShell';

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </DataProvider>
  );
}
