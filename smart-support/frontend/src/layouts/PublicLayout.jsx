import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NavigationSidebar from '../components/NavigationSidebar';

export default function PublicLayout() {
  return (
    <div className="flex-col" style={{ minHeight: '100vh' }}>
      <Navbar />
      <NavigationSidebar />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
