import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="portal-card p-8 max-w-md w-full"
    >
      <div className="mb-8 text-center">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4"
        >
          <span className="text-white font-bold text-2xl">HR</span>
        </motion.div>
        <h2 className="text-2xl font-bold text-anchor-blue">Welcome Back</h2>
        <p className="text-sm text-slate-500 mt-2">Sign in to your account</p>
      </div>
      
      <form onSubmit={handleSignIn} className="space-y-5">
        <div>
          <label htmlFor="signin-email" className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>
          <input 
            id="signin-email"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="input-field"
            placeholder="name@company.com"
          />
        </div>
        
        <div>
          <label htmlFor="signin-password" className="block text-sm font-medium text-slate-700 mb-2">
            Password
          </label>
          <input 
            id="signin-password"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="input-field"
            placeholder="Enter your password"
          />
        </div>
        
        <motion.button 
          type="submit" 
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing In...
            </span>
          ) : (
            'Sign In'
          )}
        </motion.button>
      </form>
      
      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-5 p-4 rounded-lg text-sm font-medium ${
            messageType === 'success' 
              ? 'bg-verified-green/10 text-verified-green border border-verified-green/20' 
              : messageType === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-slate-50 text-slate-700 border border-slate-200'
          }`}
        >
          {message}
        </motion.div>
      )}
    </motion.div>
  );
}

export default SignIn;
