// import React from 'react'
// import Home from './pages/Home'
// import {BrowserRouter, Route, Routes} from "react-router-dom"
// import ProtectedRoute from './components/ProtectedRoute.jsx'
// import Login from './pages/Login.jsx'
// // import Error404 from './pages/Error404.jsx'
// import Signup from './pages/Signup.jsx'


// const App = () => {
//   return (
//     <BrowserRouter>
//     <Routes>
//       <Route path='/' element={<ProtectedRoute>
//         <Home/>
//       </ProtectedRoute>}/>
//       <Route path='/login' element={<Login/>}/>
//       <Route path='/signup' element={<Signup/>}/>
//     </Routes>
//     </BrowserRouter>
//   )
// }

// export default App
import React from 'react'
import Home from './pages/Home'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
// import Error404 from './pages/Error404.jsx'
import Signup from './pages/Signup.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'


const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<ProtectedRoute>
        <Home/>
      </ProtectedRoute>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/forgot-password' element={<ForgotPassword/>}/>
      <Route path='/reset-password/:token' element={<ResetPassword/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App