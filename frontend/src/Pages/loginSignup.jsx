import React, { useState } from 'react';
import './CSS/loginSignup.css';

const LoginSignup = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  const handleSwitchForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className='login-signup'>
      <div className="login-signup-container">
        {isSignUp ? (
          <>
            <h2>Sign Up</h2>
            <form className="login-signup-form">
              <input type="text" placeholder="Full Name" />
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <input type="password" placeholder="Confirm Password" />
              <button>Sign Up</button>
            </form>
            <div className="login-signup-switch">
              <p>Already have an account? <span onClick={handleSwitchForm}>Log in</span></p>
            </div>
            <div className="signup-agreement">
              <label>
                <input type="checkbox" />
                <p>
                  By signing up, you agree to our&nbsp;
                  <span>Terms</span> and <span>Privacy Policy</span>
                </p>
              </label>
            </div>
          </>
        ) : (
          <>
            <h2>Log In</h2>
            <form className="login-signup-form">
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button>Log In</button>
            </form>
            <div className="login-signup-switch">
              <p>Don't have an account? <span onClick={handleSwitchForm}>Sign Up</span></p>
            </div>
            <div className="signup-agreement">
              <input type="checkbox" />
              <p>
                By logging in, you agree to our&nbsp;
                <span>Terms</span> and <span>Privacy Policy</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;