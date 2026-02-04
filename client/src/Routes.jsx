import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import MainLayout from "./components/MainLayout";
import ProtectedRoute, { AdminRoute } from "./components/ProtectedRoutes";

// Public Pages
import Homepage from "./pages/homepage";
import VehicleSearch from "./pages/vehicle-search";
import VehicleDetails from "./pages/vehicle-details";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import NotFound from "./pages/NotFound";
import SupportPage from "./pages/support";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import BlogPage from "./pages/blog";
import BlogPostPage from "./pages/blog-post";

// Protected User Pages
import BookingWizard from "./pages/booking-wizard";
import UserDashboard from "./pages/user-dashboard";

// Admin Pages
import AdminLayout from "./pages/admin-dashboard/components/AdminLayout";
import AdminDashboard from "./pages/admin-dashboard";
import AdminVehicleManagement from "./pages/admin-dashboard/pages/AdminVehicleManagement";
import AdminBookingManagement from "./pages/admin-dashboard/pages/AdminBookingManagement";
import AdminUserManagement from "./pages/admin-dashboard/pages/AdminUserManagement";
import AdminReviewManagement from "./pages/admin-dashboard/pages/AdminReviewManagement";
import AdminBlogManagement from "./pages/admin-dashboard/pages/AdminBlogManagement";
import AdminCategoryManagement from './pages/admin-dashboard/pages/AdminCategoryManagement';
import AdminContactManagement from './pages/admin-dashboard/pages/AdminContactManagement';
import AdminLoyaltyManagement from './pages/admin-dashboard/pages/AdminLoyaltyManagement';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public Routes (With Header/Footer) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/vehicle-search" element={<VehicleSearch />} />
            <Route path="/vehicle-details" element={<VehicleDetails />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
          </Route>

          {/* Auth Routes (Fullscreen) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/booking-wizard" element={<BookingWizard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="vehicles" element={<AdminVehicleManagement />} />
              <Route path="bookings" element={<AdminBookingManagement />} />
              <Route path="users" element={<AdminUserManagement />} />
              <Route path="reviews" element={<AdminReviewManagement />} />
              <Route path="blog" element={<AdminBlogManagement />} />
              <Route path="contact" element={<AdminContactManagement />} />
              <Route path="categories" element={<AdminCategoryManagement />} />
              <Route path="loyalty" element={<AdminLoyaltyManagement />} />
              {/* Fallback for admin sub-routes */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>

          {/* Global Fallback */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;