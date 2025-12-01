import Hero from '@/components/home/hero-section';
import Features from '@/components/home/features-grid-section';
import HowItWork from '@/components/home/how-it-work-section';
import Testimonial from '@/components/home/testimonial-section';
import CTA from '@/components/home/cta-section';
import Footer from '@/components/home/footer-section';

export default function Home() {
  return (
    <div className='flex flex-col items-center'>
      {/* Hero Section */}
      <Hero />

      {/* Features Grid */}
      <Features />

      {/* How It Works */}
      <HowItWork />

      {/* Testimonials */}
      <Testimonial />

      {/* CTA Section */}
      <CTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}
