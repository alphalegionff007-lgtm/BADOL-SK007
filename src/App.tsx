import React, { useEffect, useState } from 'react';
import { dbService, getAdminUser, setAdminUser } from './lib/supabase';
import { GymSettings } from './types';

// Website Pages
import Home from './pages/website/Home';
import About from './pages/website/About';
import Packages from './pages/website/Packages';
import Trainers from './pages/website/Trainers';
import Schedule from './pages/website/Schedule';
import Gallery from './pages/website/Gallery';
import BMI from './pages/website/BMI';
import Testimonials from './pages/website/Testimonials';
import Contact from './pages/website/Contact';
import Join from './pages/website/Join';

// Website Components
import Navbar from './components/website/Navbar';
import Footer from './components/website/Footer';

// Admin Components & Pages
import AdminSidebar from './components/admin/AdminSidebar';
import AdminTopbar from './components/admin/AdminTopbar';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Members from './pages/admin/Members';
import Leads from './pages/admin/Leads';
import AdminPackages from './pages/admin/Packages';
import AdminTrainers from './pages/admin/Trainers';
import AdminClasses from './pages/admin/Classes';
import AdminPayments from './pages/admin/Payments';
import AdminGallery from './pages/admin/Gallery';
import AdminTestimonials from './pages/admin/Testimonials';
import Settings from './pages/admin/Settings';

// Common Widgets
import Toast from './components/common/Toast';

export default function App() {
  const [hash, setHash] = useState(window.location.hash || '#home');
  const [settings, setSettings] = useState<GymSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminStateUser] = useState(getAdminUser());
  
  // Preselected parameters
  const [preselectedPackageName, setPreselectedPackageName] = useState('');

  // Toast state
  const [toastText, setToastText] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync state with url hashes
  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash || '#home');
      // Scroll to top on navigation to give a premium feel
      window.scrollTo({ top: 0, behavior: 'instant' as any });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Fetch critical gym settings
  useEffect(() => {
    async function loadGymConfigs() {
      try {
        const data = await dbService.getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load gym configs.', err);
      } finally {
        setLoading(false);
      }
    }
    loadGymConfigs();
  }, [adminUser]); // reload if gym owner updates settings or logs in

  const handleSuccessToast = (text: string) => {
    setToastText(text);
    setShowToast(true);
  };

  const handleAdminLoginSuccess = () => {
    setAdminStateUser(getAdminUser());
    handleSuccessToast('Access Authorized: Welcome back Admin!');
  };

  const handleLogout = () => {
    setAdminUser(null);
    setAdminStateUser(null);
    setHash('#home');
    handleSuccessToast('Signed out of administrative board.');
  };

  if (loading || !settings) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs uppercase font-extrabold tracking-widest text-zinc-500">Launching Iron Elite System...</p>
      </div>
    );
  }

  // Detect url sections
  const isAdminRoute = hash.startsWith('#admin');

  // Render Admin pages routing
  const renderAdminPage = () => {
    // If not authenticated and not explicitly login page, redirect to login
    if (!adminUser && hash !== '#admin/login') {
      return <Login onLoginSuccess={handleAdminLoginSuccess} setHash={setHash} />;
    }

    switch (hash) {
      case '#admin/login':
        if (adminUser) {
          // If already authenticated, bypass login
          setTimeout(() => setHash('#admin/dashboard'), 100);
          return null;
        }
        return <Login onLoginSuccess={handleAdminLoginSuccess} setHash={setHash} />;
      case '#admin/dashboard':
        return <Dashboard setHash={setHash} />;
      case '#admin/members':
        return <Members />;
      case '#admin/leads':
        return <Leads />;
      case '#admin/packages':
        return <AdminPackages />;
      case '#admin/trainers':
        return <AdminTrainers />;
      case '#admin/classes':
        return <AdminClasses />;
      case '#admin/payments':
        return <AdminPayments />;
      case '#admin/gallery':
        return <AdminGallery />;
      case '#admin/testimonials':
        return <AdminTestimonials />;
      case '#admin/settings':
        return <Settings onSuccessToast={handleSuccessToast} />;
      default:
        return <Dashboard setHash={setHash} />;
    }
  };

  // Render Public Website pages
  const renderPublicPage = () => {
    // Check clean hash variations
    const cleanHash = hash.split('?')[0];

    switch (cleanHash) {
      case '#home':
      case '':
        return (
          <Home 
            setHash={setHash} 
            settings={settings} 
            setPreselectedPackage={setPreselectedPackageName} 
            onSuccessToast={handleSuccessToast}
          />
        );
      case '#about':
        return <About settings={settings} setHash={setHash} />;
      case '#packages':
        return <Packages setHash={setHash} setPreselectedPackage={setPreselectedPackageName} />;
      case '#trainers':
        return <Trainers onSuccessToast={handleSuccessToast} whatsappNumber={settings.whatsapp_number} />;
      case '#schedule':
        return <Schedule setHash={setHash} />;
      case '#gallery':
        return <Gallery />;
      case '#bmi':
        return <BMI setHash={setHash} />;
      case '#testimonials':
        return <Testimonials />;
      case '#contact':
        return <Contact settings={settings} onSuccessToast={handleSuccessToast} />;
      case '#join':
        return (
          <Join 
            preselectedPackageName={preselectedPackageName} 
            onSuccess={handleSuccessToast} 
            setHash={setHash} 
          />
        );
      default:
        return (
          <Home 
            setHash={setHash} 
            settings={settings} 
            setPreselectedPackage={setPreselectedPackageName} 
            onSuccessToast={handleSuccessToast}
          />
        );
    }
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen font-sans selection:bg-amber-500 selection:text-zinc-950">
      
      {/* Dynamic Toast overlay feedback */}
      {showToast && (
        <Toast 
          text={toastText} 
          onClose={() => setShowToast(false)} 
        />
      )}

      {isAdminRoute ? (
        // Administrative Workspace layout
        hash === '#admin/login' && !adminUser ? (
          // Bare login screen without layout grids
          <div className="min-h-screen flex flex-col justify-between">
            <Navbar 
              currentPath={hash.replace('#', '')} 
              setHash={setHash} 
              settings={settings} 
              isAdmin={!!adminUser} 
              onLogoutAdmin={handleLogout} 
            />
            {renderAdminPage()}
            <Footer setHash={setHash} settings={settings} />
          </div>
        ) : (
          <div className="flex h-screen overflow-hidden bg-zinc-950">
            {/* Sidebar navs */}
            <AdminSidebar 
              currentPath={hash.replace('#', '')} 
              setHash={setHash} 
              onLogout={handleLogout} 
              settings={settings}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />

            {/* Content canvas container */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <AdminTopbar 
                currentPath={hash.replace('#', '')}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              
              <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-950 border-t border-l border-zinc-900 rounded-tl-3xl">
                {renderAdminPage()}
              </main>
            </div>
          </div>
        )
      ) : (
        // Public customer-facing layout website
        <div className="min-h-screen flex flex-col justify-between">
          <Navbar 
            currentPath={hash.replace('#', '')} 
            setHash={setHash} 
            settings={settings} 
            isAdmin={!!adminUser} 
            onLogoutAdmin={handleLogout} 
          />

          <main className="flex-grow pt-16">
            {renderPublicPage()}
          </main>

          <Footer 
            setHash={setHash} 
            settings={settings} 
          />
        </div>
      )}
    </div>
  );
}
