import React from 'react'

const App = ({ children }) =>
  <div style={{height: '100%'}}>
    <div className="contentDoup" style={{width: '80%', margin: 'auto', borderRadius: '20px', background: 'rgb(188, 216, 95)'}}>
      {children}
    </div>
  </div>

export default App
