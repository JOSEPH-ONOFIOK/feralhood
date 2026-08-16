import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SignalRibbon from "@/components/SignalRibbon";
import CharacterGallery from "@/components/CharacterGallery";
import ChainSection from "@/components/ChainSection";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <SignalRibbon />
        <CharacterGallery />
        <ChainSection />
      </main>
      <Footer />
    </>
  );
}
