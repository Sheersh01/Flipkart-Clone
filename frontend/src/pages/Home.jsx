import React from "react";
import { useSearchParams } from "react-router-dom";
import Carousel from "../components/Carousel";
import StillLooking from "../components/StillLooking";
import TopSelection from "../components/TopSelection";
import SuggestedForU from "../components/SuggestedForU";
import Categories from "../components/Categories";
import ProductGrid from "../components/ProductGrid";

const Home = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  return (
    <main id="main-content">
      <Carousel />
      <StillLooking />
      <TopSelection />
      <SuggestedForU />
      <Categories />
      <ProductGrid initialSearch={searchQuery} />
    </main>
  );
};

export default Home;
