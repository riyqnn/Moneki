import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import HowItWorks from "./components/HowItWorks";
import FAQSection from "./components/Faq";
import FinalCTA from "./components/FinalCta";
import Footer from "./components/Footer";
// import ResourcesSection from "./components/ResourcesSection"; // still commented

export default function Home() {
  return (
    <main className="bg-custom4 w-full flex items-center flex-col justify-center">
      <div className="w-[90%] text-foreground">

        {/* NAVBAR */}
        <div className="w-full flex justify-center">
          <Navbar className="fixed" />
        </div>

        {/* HERO */}
        <HeroSection />

        {/* ABOUT */}
        <AboutSection />

        {/* HOW IT WORKS */}
        <HowItWorks />

        {/* RESOURCES (still commented in original, so we keep it) */}
        {/*
        <ResourcesSection />
        */}

        {/* FAQ */}
        <FAQSection />

        {/* FINAL CTA */}
        <FinalCTA />

      </div>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
