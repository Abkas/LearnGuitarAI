import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from '../Pages/Homepage'
import Analyzer from "@/pages/Analyzer";

const AppRoutes = () => {
  return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyzer" element={<Analyzer />} />
        </Routes>
    )
}

export default AppRoutes