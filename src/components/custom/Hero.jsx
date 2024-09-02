import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom' // Import Link for routing

function Hero() {
  return (
    <div className='flex flex-col items-center mx-56 gap-9'>
      <h1 className='font-extrabold text-[50px] text-center mt-16 leading-tight'>
        <span className='text-[#f56551]'>Discover Your Next Adventure with AI: </span>
        <span className='text-black mt-6'>Personalized Itineraries at Your Fingertips</span>
      </h1>
      <p className='text-xl text-gray-500 text-center'>
        Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
      </p>

      {/* Use Link for navigation */}
      <Link to={'/create-trip'}>
        <Button>Get Started, It's Free</Button>
      </Link>
    </div>
  )
}

export default Hero
