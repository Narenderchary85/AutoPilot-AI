import MainLayout from './components/layout/MainLayout';
import { Route, Routes } from 'react-router'
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
     <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/chat' element={<MainLayout />}/>
        <Route path='/signup' element={<Signup />}/>
     </Routes>
    </div>
  );
}

export default App;
