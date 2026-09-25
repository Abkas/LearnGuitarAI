import { Routes as RouterRoutes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'

const AppRoutes = () => {
  return (
        <RouterRoutes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<HomePage />} />
        </RouterRoutes>
    )
}

export default AppRoutes