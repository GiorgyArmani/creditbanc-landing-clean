import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import TrustMetrics from '@/components/sections/TrustMetrics';
import Products from '@/components/sections/Products';
import ValueProp from '@/components/sections/ValueProp';
import Process from '@/components/sections/Process';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/sections/Footer';
import { FloatingSupport } from '@/components/floating-support';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <Hero />
        <TrustMetrics />
        <Products />
        <ValueProp />
        <Process />
        <CTA />
      </main>
      <Footer />
      <FloatingSupport />
    </>
  );
}
