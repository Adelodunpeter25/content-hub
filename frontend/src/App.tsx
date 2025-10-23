import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { PreferencesProvider } from './context/PreferencesContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FeedsPage = lazy(() => import('./pages/PublicFeedsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const GoogleCallbackPage = lazy(() => import('./pages/GoogleCallbackPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const FeedPage = lazy(() => import('./pages/FeedPage'));
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const StatsPage = lazy(() => import('./pages/StatsPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const TrendingPage = lazy(() => import('./pages/TrendingPage'));
const PopularPage = lazy(() => import('./pages/PopularPage'));
const ReadHistoryPage = lazy(() => import('./pages/ReadHistoryPage'));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <PreferencesProvider>
          <BrowserRouter>
            <ScrollToTop />
            <ToastProvider>
              <AuthProvider>
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                }>
                  <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/feeds" element={<FeedsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/feed" element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          } />
          <Route path="/bookmarks" element={
            <ProtectedRoute>
              <BookmarksPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="/stats" element={
            <ProtectedRoute>
              <StatsPage />
            </ProtectedRoute>
          } />
          <Route path="/search" element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          } />
          <Route path="/trending" element={
            <ProtectedRoute>
              <TrendingPage />
            </ProtectedRoute>
          } />
          <Route path="/popular" element={
            <ProtectedRoute>
              <PopularPage />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <ReadHistoryPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </AuthProvider>
            </ToastProvider>
          </BrowserRouter>
        </PreferencesProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
