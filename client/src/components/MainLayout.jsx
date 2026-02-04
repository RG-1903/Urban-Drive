import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './ui/Header';
import Footer from '../pages/homepage/components/Footer';

const MainLayout = () => {
  const location = useLocation();
  const isHomepage = location.pathname === '/' || location.pathname === '/homepage';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
    
      <main className={`flex-1 ${isHomepage ? '' : 'pt-16 lg:pt-20'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;