import ShopByCategory from "@/components/Home/Category";
import HeroSection from "@/components/Home/Hero";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ShopByCategory />
    </main>
  );
}
