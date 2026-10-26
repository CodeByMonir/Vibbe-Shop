import ShopByCategory from "@/components/Home/Category";
import CategoryShowcase from "@/components/Home/CategoryShowcase";
import HeroSection from "@/components/Home/Hero";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ShopByCategory />
      <CategoryShowcase />
    </main>
  );
}
