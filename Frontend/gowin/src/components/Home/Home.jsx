import React from 'react'
import First from './First'
import Place from './Place'
import Footer from './Footer'
import Map from './Map'
import Navbar from './Navbar'
function Home() {
  return (
    <div>
        <Navbar />
        <First />
        <Place />
        <Map />
    </div>
  )
}

export default Home