import React from "react";
import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ProductSection from "@/components/home/ProductSection";
import { Products } from "@/lib/db";

const HERO_IMAGE = "https://media.base44.com/images/public/69f48a9aa0b16ef3499ad64e/fc22a332b_generated_3576a93f.png";

const FEATURED_CATEGORIES = [
  { label: "Tops", slug: "tops", image: "https://media.base44.com/images/public/69f48a9aa0b16ef3499ad64e/d0719226f_generated_e87d5904.png" },
  { label: "Bottoms", slug: "bottoms", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80" },
  { label: "Activewear", slug: "activewear", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" },
  { label: "Footwear", slug: "footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" },
  { label: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80" },
  { label: "Essentials", slug: "essentials", image: "https://media.base44.com/images/public/69f48a9aa0b16ef3499ad64e/08d00ccd7_generated_dc898ba0.png" },
  { label: "Anime", slug: "anime", image: "https://media.base44.com/images/public/69f48a9aa0b16ef3499ad64e/68fa8811a_generated_74301611.png" },
  { label: "Thrift / Surplus", slug: "thrift-surplus", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80" },
];

export default function Home() {
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => Products.list("-created_at", 50),
  });

  const newArrivals = products.filter((p) => p.tags?.includes("new_arrival")).slice(0, 4);
  const trending = products.filter((p) => p.tags?.includes("trending")).slice(0, 4);
  const displayNewArrivals = newArrivals.length > 0 ? newArrivals : products.slice(0, 4);
  const displayTrending = trending.length > 0 ? trending : products.slice(4, 8);

  return (
    <div>
      <HeroSection imageUrl={HERO_IMAGE} />
      <FeaturedCategories categories={FEATURED_CATEGORIES} />
      {displayNewArrivals.length > 0 && (
        <ProductSection subtitle="Just Landed" title="New Arrivals" products={displayNewArrivals} viewAllLink="/shop/tops" />
      )}
      {displayTrending.length > 0 && (
        <ProductSection subtitle="Most Wanted" title="Trending Now" products={displayTrending} viewAllLink="/shop/tops" />
      )}
    </div>
  );
}
