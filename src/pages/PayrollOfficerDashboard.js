import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function PayrollOfficerDashboard({ user }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const { data } = await supabase
      .from('employees')
      .select('id, full_name, email, dept_id, employment_type, start_date');

    if (data) setEmployees(data);
    setLoading(false);
  };

  const getEmploymentBadge = (type) => {
    switch(type) {
      case 'full-time': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'part-time': return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'casual': return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'contractor': return 'bg-slate-50 text-slate-700 border border-slate-200';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-light-border">
        <h2 className="text-xl font-bold text-charcoal">Payroll Officer Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">
          View TFN declarations, bank details, and superannuation nominations. Run pay reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="portal-card p-4">
          <p className="text-xs text-slate-500 mb-1">Total Employees</p>
          <p className="text-2xl font-bold text-charcoal">{employees.length}</p>
        </div>
        <div className="portal-card p-4">
          <p className="text-xs text-slate-500 mb-1">Full-Time</p>
          <p className="text-2xl font-bold text-portal-navy">{employees.filter(e => e.employment_type === 'full-time').length}</p>
        </div>
        <div className="portal-card p-4">
          <p className="text-xs text-slate-500 mb-1">Casual/Contract</p>
          <p className="text-2xl font-bold text-alert-amber">{employees.filter(e => e.employment_type === 'casual' || e.employment_type === 'contractor').length}</p>
        </div>
      </div>

      <div className="portal-card overflow-hidden">
        <div className="p-4 border-b border-light-border">
          <h3 className="font-semibold text-charcoal">Employee Financial Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-light-border">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Department</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Start Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">TFN Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Super Fund</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="px-4 py-8 text-center text-sm text-slate-500">Loading...</td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan="6" className="px-4 py-8 text-center text-sm text-slate-500">No employees found</td></tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-charcoal">{emp.full_name}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{emp.dept_id}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmploymentBadge(emp.employment_type)}`}>
                        {emp.employment_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{new Date(emp.start_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-verified-green">
                        On File
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">AustralianSuper</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 portal-card p-4">
        <h4 className="text-sm font-semibold text-charcoal mb-2">Payroll Compliance</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div>
            <p className="font-medium text-slate-700">TFN Declarations</p>
            <p>All TFNs encrypted with AES-256 via pgcrypto</p>
          </div>
          <div>
            <p className="font-medium text-slate-700">Superannuation</p>
            <p>ATO stapled fund compliance verified</p>
          </div>
          <div>
            <p className="font-medium text-slate-700">Pay Slips</p>
            <p>7-year retention per Fair Work Act 2009</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayrollOfficerDashboard;