import React, { useState } from 'react'

import './newsletters.css'

const Newsletters = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ submitting: false, success: '', error: '' })

  const validateEmail = value => /\S+@\S+\.\S+/.test(value)

  const handleSubmit = event => {
    event.preventDefault()
    if (!validateEmail(email)) {
      setStatus({ submitting: false, success: '', error: 'Please enter a valid email.' })
      return
    }

    setStatus({ submitting: true, success: '', error: '' })
    setTimeout(() => {
      setStatus({ submitting: false, success: 'You are on the list. Expect a welcome gift shortly!', error: '' })
      setEmail('')
    }, 800)
  }

  return (
    <section className="newsletters section-shell" aria-labelledby="newsletter-heading">
      <div className="newsletters-card">
        <p className="pill">Stay in the know</p>
        <h2 id="newsletter-heading">Get Exclusive Offers &amp; News</h2>
        <p className="newsletters-copy">Be the first to hear about new capsules, limited collabs, and restocks tailored to your preferences.</p>
        <form className="newsletters-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={email}
            onChange={event => setEmail(event.target.value)}
            aria-invalid={status.error ? 'true' : 'false'}
            disabled={status.submitting}
            required
          />
          <button type="submit" disabled={status.submitting}>
            {status.submitting ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
        <div className="newsletters-feedback" aria-live="polite">
          {status.error && <p className="error">{status.error}</p>}
          {status.success && <p className="success">{status.success}</p>}
        </div>
        <p className="newsletters-footnote">By subscribing, you agree to receive emails from Shop. You can unsubscribe anytime.</p>
      </div>
    </section>
  )
}

export default Newsletters