import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { CartDrawer } from './components/CartDrawer';
import { LoginModal } from './components/LoginModal';
import { AdminPanel } from './components/AdminPanel';

function AppContent() {
  const { currentView, user } = useStore();

  return (
    <div style={{ backgroundColor: '#F5F0E8', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <Navbar />
      <main>
        {currentView === 'home' && <Hero />}
        {currentView === 'products' && <ProductGrid />}
        {currentView === 'admin' && user?.role === 'admin' && <AdminPanel />}
        {currentView === 'admin' && user?.role !== 'admin' && <Hero />}
      </main>
      <CartDrawer />
      <LoginModal />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
