import React from 'react'

import './CSS/loginSignup.css'

const LoginSignup = () => {
  return (
    <div className='login-signup'>
      <div className="login-signup-container">
        <h2>Sign Up</h2>
        <form className="login-signup-form">
          <input type="text" placeholder="Full Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />
          <button>Sign Up</button>
        </form>
        <p>Already have an account? <span>Log in</span></p>
        <div className="signup-agreement">
          <input type="checkbox" />
          <p>
            By signing up, you agree to our&nbsp;
            <span>Terms</span> and <span>Privacy Policy</span>
          </p>
        </div>

        <h2>Log In</h2>
        <form className="login-signup-form">
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Log In</button>
        </form>
        <p>Don't have an account? <span>Sign up</span></p>
        <div className="signup-agreement">
          <input type="checkbox" />
          <p>
            By signing up, you agree to our&nbsp;
            <span>Terms</span> and <span>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup