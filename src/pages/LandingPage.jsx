import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CourtsSection from "../components/CourtsSection";
import HowItWorksSection from "../components/HowItWorksSection";
import BookingWidget from "../components/BookingWidget";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div id="top">
      <Navbar />
      <Hero />
      <CourtsSection />
      <HowItWorksSection />
      <BookingWidget />
      <Footer />
    </div>
  );
}
