import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Onboardee');
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

      console.log('User created:', authData.user.id);

      await new Promise(resolve => setTimeout(resolve, 1000));

      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{
          user_id: authData.user.id,
          role_name: role
        }]);

      if (roleError) {
        console.error('Role insert error:', roleError);
        setMessage('Account created, but role assignment failed. Please contact HR.');
        setMessageType('error');
      } else {
        setMessage('Account created successfully. Role assigned: ' + role.replace('_', ' ') + '.');
        setMessageType('success');
      }

    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    }

    setLoading(false);
  };

  const roles = [
    { value: 'Onboardee', label: 'Onboardee (New Employee)' },
    { value: 'Hiring_Manager', label: 'Hiring Manager' },
    { value: 'HR_Admin', label: 'HR Administrator' },
    { value: 'IT_Staff', label: 'IT Staff' },
    { value: 'Payroll_Officer', label: 'Payroll Officer' }
  ];

  return (
    <div className="portal-card p-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-charcoal">Employee Registration</h2>
        <p className="text-sm text-slate-500 mt-1">Australian Onboarding Portal</p>
      </div>
      <form onSubmit={handleSignUp} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Work Email Address
          </label>
          <input 
            id="email"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full px-3 py-2 border border-light-border rounded-md focus:outline-none focus:ring-2 focus:ring-portal-navy focus:border-portal-navy text-sm"
            placeholder="name@company.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input 
            id="password"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            minLength="6"
            className="w-full px-3 py-2 border border-light-border rounded-md focus:outline-none focus:ring-2 focus:ring-portal-navy focus:border-portal-navy text-sm"
            placeholder="Minimum 6 characters"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">
            Select Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border border-light-border rounded-md focus:outline-none focus:ring-2 focus:ring-portal-navy focus:border-portal-navy text-sm bg-white"
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1">This determines your access level in the portal</p>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
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

export default SignUp;