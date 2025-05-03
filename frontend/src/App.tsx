import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/navbar';
import AppRoutes from './routes';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <AppRoutes />
          </main>
        </div>
      </Router>
      <Toaster richColors closeButton position="top-right" />
    </>
  );
}

export default App;
