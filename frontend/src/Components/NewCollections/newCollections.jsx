import React, { useState, useEffect } from 'react'
import Item from '../Item/item'

import './newCollections.css'

const NewCollections = () => {
  const [new_collection, setNewCollection] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/new-collections')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched data:', data);
        setNewCollection(Array.from(data.newCollections));
      })
      .catch(err => {
        console.log('Error:', err);
      });
  }, []);

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