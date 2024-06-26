import React, { useState } from 'react';
import './CSS/loginSignup.css';

const LoginSignup = () => {
  const [state, setState] = useState('Login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const login = async (e) => {
    e.preventDefault();
    console.log('Login', formData);

    let responseData;

    await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        console.log('Data:', data);
        responseData = data;
      })
      .catch(err => {
        console.log('Error:', err);
      });

    if (responseData && responseData.success) {
      localStorage.setItem('authToken', responseData.token);
      window.location.replace('/');
    } else {
      alert('Failed to login', responseData.error);
    }
  }

  const signup = async (e) => {
    e.preventDefault();
    console.log('Signup', formData);

    // Validate form data
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    let responseData;

    await fetch('http://localhost:4000/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.username,
        email: formData.email,
        password: formData.password
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log('Data:', data);
        responseData = data;
      })
      .catch(err => {
        console.log('Error:', err);
      });

    if (responseData && responseData.success) {
      localStorage.setItem('authToken', responseData.token);
      window.location.replace('/');
    } else {
      alert('Failed to signup: ' + responseData.error);
    }
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
              name="username"
              placeholder="Full Name"
              autoComplete="name"
              value={formData.username || ''}
              onChange={handleChange}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="username"
            value={formData.email || ''}
            onChange={handleChange}
          />
          {state === 'Login' ? (
            <input
              type="password"
              name='password'
              placeholder="Password"
              autoComplete="current-password"
              value={formData.password || ''}
              onChange={handleChange}
            />
          ) : (
            <input
              type="password"
              name='password'
              placeholder="Password"
              autoComplete="new-password"
              value={formData.password || ''}
              onChange={handleChange}
            />
          )}
          {state === 'Login' ? null : (
            <input
              type="password"
              name='confirmPassword'
              placeholder="Confirm Password"
              autoComplete="new-password"
              value={formData.confirmPassword || ''}
              onChange={handleChange}
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