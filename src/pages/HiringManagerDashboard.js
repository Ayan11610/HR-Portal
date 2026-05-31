import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function HiringManagerDashboard({ user }) {
  const [directReports, setDirectReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDirectReports();
  }, []);

  const fetchDirectReports = async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .neq('user_id', user.id);

    console.log('All employees (except self):', data);
    console.log('Query error:', error);

    if (data) setDirectReports(data);
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-light-border">
        <h2 className="text-xl font-bold text-charcoal">Hiring Manager Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">
          Department-scoped view. Manage your direct reports and their onboarding progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="portal-card p-4">
          <p className="text-xs text-slate-500 mb-1">Direct Reports</p>
          <p className="text-2xl font-bold text-charcoal">{directReports.length}</p>
        </div>
        <div className="portal-card p-4">
          <p className="text-xs text-slate-500 mb-1">Onboarding Complete</p>
          <p className="text-2xl font-bold text-verified-green">
            {directReports.filter(e => {
              const days = (new Date() - new Date(e.start_date)) / (1000 * 60 * 60 * 24);
              return days > 30;
            }).length}
          </p>
        </div>
        <div className="portal-card p-4">
          <p className="text-xs text-slate-500 mb-1">Pending</p>
          <p className="text-2xl font-bold text-alert-amber">
            {directReports.filter(e => {
              const days = (new Date() - new Date(e.start_date)) / (1000 * 60 * 60 * 24);
              return days <= 30;
            }).length}
          </p>
        </div>
      </div>

      <div className="portal-card overflow-hidden">
        <div className="p-4 border-b border-light-border">
          <h3 className="font-semibold text-charcoal">My Team</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-light-border">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Department</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Start Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="4" className="px-4 py-8 text-center text-sm text-slate-500">Loading...</td></tr>
              ) : directReports.length === 0 ? (
                <tr><td colSpan="4" className="px-4 py-8 text-center text-sm text-slate-500">No direct reports assigned</td></tr>
              ) : (
                directReports.map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-charcoal">{emp.full_name}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{emp.dept_id}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{new Date(emp.start_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-portal-navy h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HiringManagerDashboard;