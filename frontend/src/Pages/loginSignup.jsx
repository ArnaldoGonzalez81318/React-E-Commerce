import { useMemo, useState } from 'react';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import './CSS/loginSignup.css';

const defaultForm = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const heroCopy = {
  login: {
    eyebrow: 'Welcome back',
    title: 'Access your curated wardrobe dashboard',
    body: 'Pick up where you left off — track orders, manage saved looks, and unlock early drops tailored to you.',
    checklist: ['Secure one-tap checkout', 'Saved carts and wishlists', 'Order visibility in real time'],
  },
  signup: {
    eyebrow: 'Create an account',
    title: 'Build a personalized shop experience',
    body: 'Save your sizes, track loyalty rewards, and receive curated edits built for your style goals.',
    checklist: ['Early access to capsules', 'Size & fit recommendations', 'Member-only rewards'],
  },
};

const socialOptions = [
  { label: 'Continue with Google', provider: 'google' },
  { label: 'Continue with Apple', provider: 'apple' },
];

const LoginSignup = () => {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState(defaultForm);
  const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copy = heroCopy[mode];

  const headline = useMemo(
    () => (mode === 'login' ? "Don't have an account?" : 'Already have an account?'),
    [mode]
  );

  const headlineCta = mode === 'login' ? 'Create an account' : 'Back to login';

  const handleModeChange = nextMode => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setFormData(defaultForm);
    setShowPassword({ password: false, confirmPassword: false });
    setStatus({ type: 'idle', message: '' });
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (status.type !== 'idle') {
      setStatus({ type: 'idle', message: '' });
    }
  };

  const toggleVisibility = field => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const issues = [];
    if (!formData.email.trim()) issues.push('email');
    if (!formData.password.trim()) issues.push('password');
    if (mode === 'signup') {
      if (!formData.username.trim()) issues.push('full name');
      if (!formData.confirmPassword.trim()) issues.push('confirmation');
      if (formData.password !== formData.confirmPassword) issues.push('matching passwords');
    }
    return issues;
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const issues = validateForm();
    if (issues.length) {
      setStatus({ type: 'error', message: `Please add ${issues.join(', ')}` });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: 'info', message: mode === 'login' ? 'Authenticating…' : 'Creating your profile…' });

    try {
      const endpoint = mode === 'login' ? 'http://localhost:4000/login' : 'http://localhost:4000/signup';
      const payload =
        mode === 'login'
          ? {
            email: formData.email,
            password: formData.password,
          }
          : {
            name: formData.username,
            email: formData.email,
            password: formData.password,
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Unable to process request.');
      }

      localStorage.setItem('authToken', data.token);
      setStatus({ type: 'success', message: 'Success! Redirecting you back to the shop…' });
      setTimeout(() => window.location.replace('/'), 600);
    } catch (error) {
      console.error('Auth error', error);
      setStatus({ type: 'error', message: error.message || 'Unexpected error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-grid">
        <aside className="auth-hero">
          <p className="auth-eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="auth-body">{copy.body}</p>
          <ul className="auth-checklist">
            {copy.checklist.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="auth-stats">
            <div>
              <p className="stat-value">48k+</p>
              <p className="stat-label">Members across regions</p>
            </div>
            <div>
              <p className="stat-value">4.9/5</p>
              <p className="stat-label">Average satisfaction</p>
            </div>
            <div>
              <p className="stat-value">72h</p>
              <p className="stat-label">Priority support SLA</p>
            </div>
          </div>
          <div className="auth-caption">
            <p className="switch-copy">{headline}</p>
            <button type="button" className="btn-secondary" onClick={() => handleModeChange(mode === 'login' ? 'signup' : 'login')}>
              {headlineCta}
            </button>
          </div>
        </aside>

        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              className={mode === 'login' ? 'auth-tab is-active' : 'auth-tab'}
              onClick={() => handleModeChange('login')}
            >
              Login
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signup'}
              className={mode === 'signup' ? 'auth-tab is-active' : 'auth-tab'}
              onClick={() => handleModeChange('signup')}
            >
              Sign Up
            </button>
          </div>

          {status.type !== 'idle' && (
            <div className={`auth-status auth-status-${status.type}`} role="status" aria-live="polite">
              {status.message}
            </div>
          )}

          {mode === 'signup' && (
            <label className="field">
              <span>Full name</span>
              <input
                type="text"
                name="username"
                autoComplete="name"
                placeholder="Jordan Carter"
                value={formData.username}
                onChange={handleChange}
              />
            </label>
          )}

          <label className="field">
            <span>Email address</span>
            <input
              type="email"
              name="email"
              autoComplete="username"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <div className="password-field">
              <input
                type={showPassword.password ? 'text' : 'password'}
                name="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => toggleVisibility('password')}
                aria-label={showPassword.password ? 'Hide password' : 'Show password'}
              >
                {showPassword.password ? <IoEyeOff /> : <IoEye />}
              </button>
            </div>
          </label>

          {mode === 'signup' && (
            <label className="field">
              <span>Confirm password</span>
              <div className="password-field">
                <input
                  type={showPassword.confirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => toggleVisibility('confirmPassword')}
                  aria-label={showPassword.confirmPassword ? 'Hide confirmation' : 'Show confirmation'}
                >
                  {showPassword.confirmPassword ? <IoEyeOff /> : <IoEye />}
                </button>
              </div>
            </label>
          )}

          <button type="submit" className="btn-primary auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}
          </button>

          <div className="auth-divider" role="presentation">
            <span>or continue with</span>
          </div>

          <div className="auth-social-group">
            {socialOptions.map(option => (
              <button key={option.provider} type="button" className="auth-social-button">
                {option.label}
              </button>
            ))}
          </div>

          {mode === 'signup' ? (
            <p className="auth-fine-print">
              By creating an account you agree to our <a href="/" aria-label="View terms">Terms</a> and{' '}
              <a href="/" aria-label="View privacy policy">Privacy Policy</a>.
            </p>
          ) : (
            <p className="auth-fine-print">
              Forgot your password? <a href="/" aria-label="Recover password">Reset it here</a>.
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default LoginSignup;