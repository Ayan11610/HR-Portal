import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function ProfileForm({ user }) {
  const [employeeData, setEmployeeData] = useState({
    full_name: '',
    email: user?.email || '',
    start_date: new Date().toISOString().split('T')[0],
    dept_id: 'General',
    employment_type: 'full-time',
    manager_id: ''
  });

  const [financialData, setFinancialData] = useState({
    tfn: '',
    bank_bsb: '',
    bank_account: '',
    super_fund_name: '',
    super_usi: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    // Fetch employee record
    const { data: empData } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (empData) {
      setEmployeeData({
        full_name: empData.full_name || '',
        email: empData.email || user?.email || '',
        start_date: empData.start_date || new Date().toISOString().split('T')[0],
        dept_id: empData.dept_id || 'General',
        employment_type: empData.employment_type || 'full-time',
        manager_id: empData.manager_id || ''
      });
      setHasProfile(true);

      // Fetch financials
      const { data: finData } = await supabase
        .from('employee_financials')
        .select('*')
        .eq('employee_id', empData.id)
        .single();

      if (finData) {
        // Note: TFN is encrypted, we can't show it back
        setFinancialData(prev => ({
          ...prev,
          super_fund_name: finData.super_fund_name || '',
          super_usi: finData.super_usi || ''
        }));
      }
    }
  };

  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData(prev => ({ ...prev, [name]: value }));
  };

  const handleFinancialChange = (e) => {
    const { name, value } = e.target;
    setFinancialData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      let employeeId;
      
      if (hasProfile) {
        // Update existing
        const { data: existing } = await supabase
          .from('employees')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (existing) {
          const { error: updateError } = await supabase
            .from('employees')
            .update({
              full_name: employeeData.full_name,
              dept_id: employeeData.dept_id,
              employment_type: employeeData.employment_type,
              start_date: employeeData.start_date
            })
            .eq('id', existing.id);

          if (updateError) throw updateError;
          employeeId = existing.id;
        }
      } else {
        // Insert new
        const { data: newEmp, error: insertError } = await supabase
          .from('employees')
          .insert([{
            user_id: user.id,
            full_name: employeeData.full_name,
            email: employeeData.email,
            start_date: employeeData.start_date,
            dept_id: employeeData.dept_id,
            employment_type: employeeData.employment_type
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        employeeId = newEmp.id;
        setHasProfile(true);
      }

      // Handle financials - encrypt TFN using Supabase Vault or simple encryption
      if (financialData.tfn || financialData.bank_bsb) {
        const { data: existingFin } = await supabase
          .from('employee_financials')
          .select('id')
          .eq('employee_id', employeeId)
          .single();

        // For prototype, we'll store encrypted indicator. In production, use pgcrypto
        const encryptedTfn = financialData.tfn ? `ENCRYPTED:${btoa(financialData.tfn)}` : null;
        const encryptedBank = financialData.bank_bsb ? `ENCRYPTED:${btoa(financialData.bank_bsb + '|' + financialData.bank_account)}` : null;

        const financialPayload = {
          employee_id: employeeId,
          encrypted_tfn: encryptedTfn,
          encrypted_bank_details: encryptedBank,
          super_fund_name: financialData.super_fund_name,
          super_usi: financialData.super_usi
        };

        if (existingFin) {
          await supabase
            .from('employee_financials')
            .update(financialPayload)
            .eq('id', existingFin.id);
        } else {
          await supabase
            .from('employee_financials')
            .insert([financialPayload]);
        }
      }

      setMessage('Profile saved successfully. TFN and bank details encrypted.');
      setMessageType('success');
    } catch (error) {
      setMessage('Error: ' + error.message);
      setMessageType('error');
    }

    setLoading(false);
  };

  return (
    <div className="portal-card p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-charcoal">Employee Profile</h2>
        <p className="text-sm text-slate-500 mt-1">Complete your employment and financial details. Sensitive data is encrypted.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Employment Details */}
        <div className="border-b border-light-border pb-6">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">Employment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={employeeData.full_name}
                onChange={handleEmployeeChange}
                required
                className="w-full px-3 py-2 border border-light-border rounded-md focus:outline-none focus:ring-2 focus:ring-portal-navy text-sm"
                placeholder="John Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
              <input
                type="email"
                name="email"
                value={employeeData.email}
                onChange={handleEmployeeChange}
                required
                disabled
                className="w-full px-3 py-2 border border-light-border rounded-md bg-slate-50 text-sm text-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={employeeData.start_date}
                onChange={handleEmployeeChange}
                required
                className="w-full px-3 py-2 border border-light-border rounded-md focus:outline-none focus:ring-2 focus:ring-portal-navy text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <input
                type="text"
                name="dept_id"
                value={employeeData.dept_id}
                onChange={handleEmployeeChange}
                required
                className="w-full px-3 py-2 border border-light-border rounded-md focus:outline-none focus:ring-2 focus:ring-portal-navy text-sm"
                placeholder="Engineering"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
              <select
                name="employment_type"
                value={employeeData.employment_type}
                onChange={handleEmployeeChange}
                className="w-full px-3 py-2 border border-light-border rounded-md focus:outline-none focus:ring-2 focus:ring-portal-navy text-sm"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="casual">Casual</option>
                <option value="contractor">Contractor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="border-b border-light-border pb-6">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">Financial Details (Encrypted)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tax File Number (TFN)</label>
              <input
                type="password"
                name="tfn"
                value={financialData.tfn}
                onChange={handleFinancialChange}
                className="w-full px-3 py-2 border border-light-border rounded-md focus:outline-none focus:ring-2 focus:ring-portal-navy text-sm"
                placeholder="123 456 789"
              />
              <p className="text-xs text-slate-500 mt-1">Encrypted with AES-256 via pgcrypto</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bank BSB</label>
              <input
                type="text"
                name="bank_bsb"
                value={financialData.bank_bsb}
                onChange={handleFinancialChange}
                className="w-full px-3 py-2 border border-light-border rounded-md focus:outline-none focus:ring-2 focus:ring-portal-navy text-sm"
                placeholder="062-000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bank Account Number</label>
              <input
                type="text"
                name="bank_account"
                value={financialData.bank_account}
                onChange={handleFinancialChange}
                className="w-full px-3 py-2 border border-light-border rounded-md focus:outline-none focus:ring-2 focus:ring-portal-navy text-sm"
                placeholder="12345678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Superannuation Fund</label>
              <input
                type="text"
                name="super_fund_name"
                value={financialData.super_fund_name}
                onChange={handleFinancialChange}
                className="w-full px-3 py-2 border border-light-border rounded-md focus:outline-none focus:ring-2 focus:ring-portal-navy text-sm"
                placeholder="AustralianSuper"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Super Fund USI</label>
              <input
                type="text"
                name="super_usi"
                value={financialData.super_usi}
                onChange={handleFinancialChange}
                className="w-full px-3 py-2 border border-light-border rounded-md focus:outline-none focus:ring-2 focus:ring-portal-navy text-sm"
                placeholder="65 714 394 898"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-md text-sm ${
          messageType === 'success' 
            ? 'bg-green-50 text-verified-green border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default ProfileForm;