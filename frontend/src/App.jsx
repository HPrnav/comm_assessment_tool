import React from 'react'
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom"
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { Assessment } from './pages/Assessment'
import { Landing } from './pages/Landing'
import { Home } from './pages/Home'
import VideosPage from './pages/VideosPage'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes >
          <Route path='/' element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/assessment" element={<Assessment />}></Route>
          <Route path="/home" element={<Home />} />
          <Route path='/videos' element={<VideosPage />} />

        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App