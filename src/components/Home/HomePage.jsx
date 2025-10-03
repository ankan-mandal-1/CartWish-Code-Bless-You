import React from 'react'
import HeroSection from './HeroSection'

import banner from "../../assets/banner.jpg"
import FeaturedProducts from './FeaturedProducts'

const HomePage = () => {
  return (
    <div>
        <HeroSection 
        title="Buy iPhone 14 Pro" 
        subtitle="Experience the power of the latest iPhone 14 with our most Pro camera ever" 
        link="/" 
        image={banner}
        />
        <FeaturedProducts />
        <HeroSection 
        title="Build the ultimate setup" 
        subtitle="You can add studio display and color match magic accesories to your bag after configure your Mac mini." 
        link="/" 
        image={banner}
        />
    </div>
  )
}

export default HomePage