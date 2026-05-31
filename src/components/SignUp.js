import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('Creating account...');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) {
        throw new Error('Auth failed: ' + authError.message);
      }

      if (!authData.user) {
        throw new Error('No user returned from auth');
      }

      setMessage('Account created successfully. Default role: Onboardee. HR Admin can change your role if needed.');
      setMessageType('success');

    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    }

    setLoading(false);
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
        <h2 className="text-2xl font-bold text-anchor-blue">Create Account</h2>
        <p className="text-sm text-slate-500 mt-2">Start your onboarding journey</p>
      </div>
      
      <form onSubmit={handleSignUp} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            Work Email Address
          </label>
          <input 
            id="email"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="input-field"
            placeholder="name@company.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
            Password
          </label>
          <input 
            id="password"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            minLength="6"
            className="input-field"
            placeholder="Minimum 6 characters"
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
              Creating Account...
            </span>
          ) : (
            'Create Account'
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
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message}
        </motion.div>
      )}
    </motion.div>
  );
}

export default SignUp;
