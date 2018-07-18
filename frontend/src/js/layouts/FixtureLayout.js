import React from 'react'
import FixtureNavbar from "../navbars/FixtureNavbar";

const FixtureLayout = ({ children }) =>
  <div style={{height: '100%'}}>
      <FixtureNavbar />
    <div className="contentDoup" style={{width: '80%', margin: 'auto', borderRadius: '20px', background: 'rgb(188, 216, 95)'}}>
      {children}
    </div>
  </div>

export default FixtureLayout
