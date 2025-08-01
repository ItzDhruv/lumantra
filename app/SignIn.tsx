'use client';

import { useState } from 'react';

//  Type-safe user credentials object
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

    //  Check username and password match
    if (users[username] && users[username] === password) {
      localStorage.setItem('loggedInUser', username);
      onLogin(username);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80 space-y-4">
        <h2 className="text-2xl font-semibold text-center">Sign In</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
