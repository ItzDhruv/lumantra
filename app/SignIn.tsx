'use client';

import { useState } from 'react';

const users: Record<string, string> = {
  'deepalimurale': 'deepalimurale@lumantra',
  'ojaswi': 'ojaswi@lumantra',
  'dhruv': 'dhruv@lumantra'
};

interface SignInProps {
  onLogin: (user: string) => void;
}

export default function SignIn({ onLogin }: SignInProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (users[username] && users[username] === password) {
      localStorage.setItem('loggedInUser', username);
      onLogin(username);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-blue-200 w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-blue-600">Lumantra</h1>
          <p className="mt-1 text-gray-600 text-sm">Welcome back! Please sign in to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
