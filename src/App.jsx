import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { AuthUserProvider } from './context/AuthUserContext';
import { LanguageProvider } from './context/LanguageContext';
// Add page imports here
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import VillagePage from './pages/VillagePage';
import SupportPage from './pages/SupportPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import MembershipPage from './pages/MembershipPage';
import VouchersPage from './pages/VouchersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminDashboard from './pages/AdminDashboard';
import TiersPage from './pages/TiersPage';
import AIDesignPage from './pages/AIDesignPage';
import CommitmentsPage from './pages/CommitmentsPage';
import Layout from './components/Layout';

import { useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from 'react-router-dom';

const ErrorHandler = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'missing_google_env') {
      toast({
        title: "Lỗi cấu hình hệ thống",
        description: "Tính năng Đăng nhập bằng Google hiện chưa được quản trị viên cấu hình (thiếu GOOGLE_CLIENT_ID). Vui lòng thử đăng nhập bằng tài khoản thông thường.",
        variant: "destructive",
        duration: 8000
      });
      // Remove error from URL
      searchParams.delete('error');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, toast]);
  
  return null;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
    // We intentionally ignore 'auth_required' here to allow public access to the pages
  }

  // Render the main app
  return (
    <>
      <ErrorHandler />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/village" element={<VillagePage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/tiers" element={<TiersPage />} />
        <Route path="/vouchers" element={<VouchersPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/ai-design" element={<AIDesignPage />} />
        <Route path="/commitments" element={<CommitmentsPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
    </>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <LanguageProvider>
          <AuthUserProvider>
            <Router>
              <ScrollToTop />
              <AuthenticatedApp />
            </Router>
            <Toaster />
          </AuthUserProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App