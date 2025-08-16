import React from 'react'
import SliderSection from '../SliderSection/SliderSection'
import CategoryCards from '../CategoryCards/CategoryCards'
import DiscountedProductsSlider from '../DiscountedProductsSlider/DiscountedProductsSlider'
import Brands from './Brands'
import Testimonials from './Testimonials'
import { Helmet } from 'react-helmet-async'
import WhyChooseUs from './WhyChooseUs'
import SalesPromotion from './SalesPromotion'
import Newsletter from './Newsletter'

function Home() {
  return (
    <div>
       <Helmet>
        <title>Home | MediShop</title>
      </Helmet>
 <SliderSection></SliderSection>
<WhyChooseUs></WhyChooseUs>
 <CategoryCards></CategoryCards>
 <SalesPromotion></SalesPromotion>
 <DiscountedProductsSlider></DiscountedProductsSlider>
 <Brands></Brands>
 <Newsletter></Newsletter>
 <Testimonials></Testimonials>
    </div>
  )
}

export default Home
