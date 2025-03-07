import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import universityLogo from '../../assets/university-logo.png';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token);
      setError('');
      navigate('/dashboard'); // Redirect to the dashboard
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('../../assets/background.jpeg')" }}>
      <div className="bg-white p-10 rounded-xl shadow-lg text-center w-96">
        <img src={universityLogo} alt="University Logo" className="w-48 h-48 mx-auto mb-5" />
        <h2 className="text-2xl text-gray-800 mb-2">University Management System</h2>
        <h3 className="text-lg text-gray-600 mb-5">Login</h3>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-4 mb-5">
            <input
              type="text"
              placeholder="Username / Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md text-lg hover:bg-blue-600 transition duration-300">Login</button>
        </form>
        <div className="mt-4 text-sm">
          <a href="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
