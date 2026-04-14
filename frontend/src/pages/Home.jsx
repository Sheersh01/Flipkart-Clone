import React from 'react'
import Carousel from '../components/Carousel'
import StillLooking from '../components/StillLooking'
import TopSelection from '../components/TopSelection'
import SuggestedForU from '../components/SuggestedForU'
import Categories from '../components/Categories'
import ProductGrid from '../components/ProductGrid'

const Home = () => {
  return (
    <main id="main-content">
        <Carousel />
        <StillLooking />
        <TopSelection />
        <SuggestedForU />
        <Categories />
        <ProductGrid />
      </main>
  )
}

export default Home