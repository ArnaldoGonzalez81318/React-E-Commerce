import React from 'react'

import './newsletters.css'

const Newsletters = () => {
  return (
    <div className='newsletters'>
      <h2>Get Exclusive Offers & News</h2>
      <p>Sign up for our newsletter and be the first to know about our sales and specials</p>

      <form action=''>
        <input type='email' placeholder='Enter your email address' />
        <button type='submit'>Subscribe</button>
      </form>
    </div>
  )
}

export default Newsletters