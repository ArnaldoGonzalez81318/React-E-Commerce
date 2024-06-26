import React, { useState } from 'react';
import './CSS/loginSignup.css';

const LoginSignup = () => {
  const [state, setState] = useState('Login');

  const login = async (e) => {
    e.preventDefault();
    console.log('Login');
  }

  const signup = async (e) => {
    e.preventDefault();
    console.log('Signup');
  }

  return (
    <div className='login-signup'>
      <div className="login-signup-container">
        <div className="login-signup-header">
          <h2>{state}</h2>
        </div>
        <form className="login-signup-form">
          {state === 'Login' ? null : (
            <input
              type="text"
              placeholder="Full Name"
              autoComplete="name"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            autoComplete="username"
          />
          {state === 'Login' ? (
            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
            />
          ) : (
            <input
              type="password"
              placeholder="Password"
              autoComplete="new-password"
            />
          )}
          {state === 'Login' ? null : (
            <input
              type="password"
              placeholder="Confirm Password"
              autoComplete="new-password"
            />
          )}
          <button type="submit" onClick={state === 'Login' ? login : signup}>
            {state}
          </button>
        </form>
        <div className="login-signup-switch">
          <p>
            {state === 'Login'
              ? "Don't have an account?"
              : 'Already have an account?'}
            <span onClick={() => setState(state === 'Login' ? 'Signup' : 'Login')}>
              {state === 'Login' ? 'Signup' : 'Login'}
            </span>
          </p>
        </div>
        {state === 'Login' ? null : (
          <div className="login-signup-agreement">
            <p>
              By creating an account, you agree to our <span>Terms & Privacy</span>.
            </p>
          </div>
        )}
        <div className="login-signup-footer">
          {state === 'Login' ? (
            <p>Or login with your social account</p>
          ) : (
            <p>Or signup with your social account</p>
          )}
          <div className="login-signup-social">
            <button>Sign in with Facebook</button>
            <button>Sign in with Google</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;