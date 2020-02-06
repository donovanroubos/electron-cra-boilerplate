import React from 'react'
import logo from '../../assets/img/logo.svg'

// Styles
import './app.scss'

function App() {
  return (
    <>
      <div className="header-arrow" />

      <div className="app">
        <header className="app-header">
          <img src={logo} className="app-logo" alt="logo" />
        </header>
      </div>
    </>
  )
}

export default App
