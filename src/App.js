import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // ✅ Add this import
import Register from './components/Register';
import Login from './components/Login';
import Board from './components/Board';

function App() {
  const token = localStorage.getItem("token");

  return (
    <>
    <BrowserRouter> {/* ✅ Move BrowserRouter outside for consistency */}
      <div className="App">
        {!token ? (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        ) : (
          <Board />
        )}
      </div>
    </BrowserRouter>
    </>
  );
}

export default App;
