import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import './descriptionBox.css'

const tabs = [
  { id: 'description', label: 'Description' },
  { id: 'fabric', label: 'Fabric & care' },
  { id: 'shipping', label: 'Delivery & support' },
]

const DescriptionBox = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description')

  const descriptionCopy = useMemo(() => {
    const text = product?.description ||
      'Designed in-house with premium materials, this piece blends effortless style with technical comfort. Expect sculpted tailoring, breathable performance fabrics, and thoughtful detailing for versatile wear.'
    return text.split(/\n+/).filter(Boolean)
  }, [product])

  const fabricDetails = product?.fabricDetails || [
    { label: 'Composition', value: '62% recycled polyester, 28% organic cotton, 10% elastane' },
    { label: 'Feel', value: 'Structured exterior with brushed interior for softness' },
    { label: 'Care', value: 'Machine wash cold, tumble dry low, do not bleach' },
    { label: 'Origin', value: 'Responsibly made in Portugal' },
  ]

  const shippingDetails = [
    { title: 'Delivery', copy: 'Standard (3-5 days) and Express (1-2 days) options available at checkout.' },
    { title: 'Returns', copy: 'Free 30-day returns with instant credit or refund once scanned by the carrier.' },
    { title: 'Support', copy: 'Talk to our stylists 7 days a week for sizing, fit, and pairing advice.' },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'fabric':
        return (
          <dl className='description-grid'>
            {fabricDetails.map(detail => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
        )
      case 'shipping':
        return (
          <div className='description-cards'>
            {shippingDetails.map(detail => (
              <article key={detail.title}>
                <h3>{detail.title}</h3>
                <p>{detail.copy}</p>
              </article>
            ))}
          </div>
        )
      default:
        return (
          <div className='description-copy'>
            {descriptionCopy.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )
    }
  }

  return (
    <section className='description-box'>
      <div className='description-shell card'>
        <header className='description-head'>
          <p className='eyebrow'>Product insights</p>
          <h2>Everything you need to know</h2>
        </header>
        <div className='description-tabs' role='tablist' aria-label='Product details tabs'>
          {tabs.map(tab => (
            <button
              key={tab.id}
              type='button'
              role='tab'
              aria-selected={activeTab === tab.id}
              className={activeTab === tab.id ? 'tab is-active' : 'tab'}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className='description-content' role='tabpanel'>
          {renderContent()}
        </div>
      </div>
    </section>
  )
}

DescriptionBox.propTypes = {
  product: PropTypes.shape({
    description: PropTypes.string,
    fabricDetails: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
      }),
    ),
  }),
}

export default DescriptionBox