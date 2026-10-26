import ShopByCategory from "@/components/Home/Category";
import HeroSection from "@/components/Home/Hero";
import CategoryShowcase from "./test/page";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ShopByCategory />
      <CategoryShowcase />
    </main>
  );
}
