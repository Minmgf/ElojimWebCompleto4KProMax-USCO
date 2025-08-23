import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import ImpactAreas from '@/components/ImpactAreas'
import MisionVision from '@/components/MisionVision'
import News from '@/components/News'
import React from 'react'

const page = () => {
  return (
    <div>
      <Hero/>
      <MisionVision/>
      <ImpactAreas/>
      <News/>
      <Footer/>
    </div>
  )
}

export default page
