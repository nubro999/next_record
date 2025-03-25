'use client';


import { useState } from 'react';
import { login } from '../../lib/api';
import { useRouter } from 'next/navigation';
import { LoginCredentials } from '../../types';
import { useAuth } from '../../context/AuthContext';

export default function LoginForm() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login(credentials);
      if (response.success === false) {
        setError(response.message || 'Login failed');
      } else {
        console.log('Login successful');
        // Fetch user data or use a dummy user object if not available
        const userData = {
          id: 1,
          username: credentials.username,
          email: `${credentials.username}@example.com`
        };
        
        // Update auth context with the token and user data
        authLogin(response, userData);
        
        // Redirect to diary page
        router.push('/diary');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" text-black max-w-md mx-auto bg-white p-6 rounded shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={credentials.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={credentials.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 rounded text-white bg-accent hover:bg-accent/90 focus:outline-none disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center text-sm">
        <p>Don't have an account? <a href="/register" className="text-accent hover:underline">Register</a></p>
      </div>
    </div>
  );
}