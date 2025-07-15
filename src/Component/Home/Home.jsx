import React from 'react'
import SliderSection from '../SliderSection/SliderSection'
import CategoryCards from '../CategoryCards/CategoryCards'
import DiscountedProductsSlider from '../DiscountedProductsSlider/DiscountedProductsSlider'
import Brands from './Brands'
import Testimonials from './Testimonials'
import { Helmet } from 'react-helmet-async'

function Home() {
  return (
    <div>
       <Helmet>
        <title>Home | MediShop</title>
      </Helmet>
 <SliderSection></SliderSection>
 <CategoryCards></CategoryCards>
 <DiscountedProductsSlider></DiscountedProductsSlider>
 <Brands></Brands>
 <Testimonials></Testimonials>
    </div>
  )
}

export default Home
