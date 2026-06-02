import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Tests from "./pages/Tests";
import Notes from "./pages/Notes";
import Leaderboard from "./pages/Leaderboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Ytclass from "./pages/Ytclass";
import Profile from "./pages/Profile";
import Referrals from "./pages/Referrals";
import PurchaseHistory from "./pages/PurchaseHistory";
import Notifications from "./pages/Notifications";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import RefundPolicy from "./pages/RefundPolicy";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChemistryLoader from "@/components/ui/ChemistryLoader";

const queryClient = new QueryClient();

const App = () => {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Lock scroll on mount
    document.body.style.overflow = "hidden";

    // Deliberate splash duration of 2.2 seconds to showcase premium animation
    const timer = setTimeout(() => {
      setAppReady(true);
      // Unlock scroll on complete
      document.body.style.overflow = "";
    }, 2200);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AnimatePresence mode="wait">
          {!appReady ? (
            <motion.div
              key="splash-screen"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-background"
            >
              <ChemistryLoader size="lg" />
            </motion.div>
          ) : (
            <motion.div
              key="app-main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AuthProvider>
                  <ScrollToTop />
                  <Toaster />
                  <Sonner />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:category" element={<Courses />} />
                    <Route path="/course/:id" element={<CourseDetails />} />
                    <Route path="/tests" element={<Tests />} />
                    <Route path="/tests/:category" element={<Tests />} />
                    <Route path="/notes" element={<Notes />} />
                    <Route path="/notes/:category" element={<Notes />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/purchases" element={<ProtectedRoute><PurchaseHistory /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
                    <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/Ytclass" element={<Ytclass />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AuthProvider>
              </BrowserRouter>
            </motion.div>
          )}
        </AnimatePresence>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
