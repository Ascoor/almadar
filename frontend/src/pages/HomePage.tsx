// src/pages/HomePage.tsx
import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import TrustSection from '@/components/landing/TrustSection'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'
import PricingSection from '@/components/landing/PricingSection'
import FAQSection from '@/components/landing/FAQSection'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()
  const handleSignInClick = () => navigate('/login')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onSignInClick={handleSignInClick} />
      <main className="space-y-6">
        <HeroSection onSignInClick={handleSignInClick} />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <TrustSection />
        <FAQSection />
        <CTASection onSignInClick={handleSignInClick} />
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
