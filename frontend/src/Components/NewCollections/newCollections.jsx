import React from 'react'
import new_collection from '../Assets/new_collections'
import Item from '../Item/item'

import './newCollections.css'

const NewCollections = () => {
  return (
    <div className="newCollections">
      <h2>New Collections</h2>
      <hr />
      <div className="collections">
        {new_collection.map((item) => {
          return (
            <Item key={item.id} image={item.image} name={item.name} old_price={item.old_price} new_price={item.new_price} />
          )
        })}
      </div>
    </div>
  )
}

export default NewCollections