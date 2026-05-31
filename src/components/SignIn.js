import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function SignIn({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('Authenticating...');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setLoading(false);

    if (error) {
      setMessage('Authentication failed: ' + error.message);
      setMessageType('error');
    } else {
      setMessage('Authentication successful.');
      setMessageType('success');
      onLogin(data.user);
    }
  };

  return (
    <div className="portal-card p-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-charcoal">Secure Sign In</h2>
        <p className="text-sm text-slate-500 mt-1">Australian Onboarding Portal</p>
      </div>
      <form onSubmit={handleSignIn} className="space-y-5">
        <div>
          <label htmlFor="signin-email" className="block text-sm font-medium text-slate-700 mb-1">
            Email Address
          </label>
          <input 
            id="signin-email"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full px-3 py-2 border border-light-border rounded-md focus:outline-none focus:ring-2 focus:ring-portal-navy focus:border-portal-navy text-sm"
            placeholder="name@company.com"
          />
        </div>
        <div>
          <label htmlFor="signin-password" className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input 
            id="signin-password"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="w-full px-3 py-2 border border-light-border rounded-md focus:outline-none focus:ring-2 focus:ring-portal-navy focus:border-portal-navy text-sm"
            placeholder="Enter your password"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      {message && (
        <div className={`mt-4 p-3 rounded-md text-sm ${
          messageType === 'success' 
            ? 'bg-green-50 text-verified-green border border-green-200' 
            : messageType === 'error'
            ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-slate-50 text-slate-700 border border-slate-200'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default SignIn;