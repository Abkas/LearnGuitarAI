import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from '../Pages/Homepage'

const Routes = () => {
  return (
        <Routes>
            <Route path="/" element={<HomePage />} />

        </Routes>
    )
}

export default Routes