// src/pages/HomePage.tsx
import { useState } from "react";

import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TrustSection from "@/components/landing/TrustSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import LoginModal from "@/components/organisms/Login.tsx";
import AuthSpinner from "@/components/common/Spinners/AuthSpinner";

const HomePage = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignInClick = () => setShowLoginForm(true);
  const handleCloseLogin = () => setShowLoginForm(false);

  const handleLoginSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setShowLoginForm(false);
    console.log("Login attempt:", { email, password });
  };

  if (isLoading) return <AuthSpinner />;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar onSignInClick={handleSignInClick} />
      <main>
        <HeroSection onSignInClick={handleSignInClick} />
        <FeaturesSection />
        <HowItWorksSection />
        <TrustSection />
        <CTASection onSignInClick={handleSignInClick} />
      </main>
      <Footer />
      <LoginModal
        isOpen={showLoginForm}
        onClose={handleCloseLogin}
        isLoading={isLoading}
        onSubmit={handleLoginSubmit}
      />
    </div>
  );
};

export default HomePage;
