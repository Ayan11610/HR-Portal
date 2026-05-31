import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import RoleManager from '../components/RoleManager';

function AdminDashboard({ user }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  const fetchAllEmployees = async () => {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        id,
        full_name,
        email,
        employment_type,
        start_date,
        dept_id,
        archived,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (data) {
      setEmployees(data);
    }
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
        <h2 className="text-xl font-bold text-charcoal">HR Administrator Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">
          Full system access. Manage all employee records, compliance status, and audit reports.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="portal-card p-4">
          <p className="text-xs text-slate-500 mb-1">Total Employees</p>
          <p className="text-2xl font-bold text-charcoal">{employees.length}</p>
        </div>
        <div className="portal-card p-4">
          <p className="text-xs text-slate-500 mb-1">Active</p>
          <p className="text-2xl font-bold text-verified-green">{employees.filter(e => !e.archived).length}</p>
        </div>
        <div className="portal-card p-4">
          <p className="text-xs text-slate-500 mb-1">Archived</p>
          <p className="text-2xl font-bold text-red-600">{employees.filter(e => e.archived).length}</p>
        </div>
        <div className="portal-card p-4">
          <p className="text-xs text-slate-500 mb-1">Pending Onboarding</p>
          <p className="text-2xl font-bold text-alert-amber">{
            employees.filter(e => {
              const daysSinceStart = (new Date() - new Date(e.start_date)) / (1000 * 60 * 60 * 24);
              return daysSinceStart < 45 && !e.archived;
            }).length
          }</p>
        </div>
      </div>

      {/* Employee Table */}
      <div className="portal-card overflow-hidden mb-6">
        <div className="p-4 border-b border-light-border flex items-center justify-between">
          <h3 className="font-semibold text-charcoal">All Employee Records</h3>
          <span className="text-xs text-slate-500">7-Year Retention Active</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-light-border">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Email</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Department</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Start Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-sm text-slate-500">Loading...</td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-sm text-slate-500">No employees found</td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-charcoal">{emp.full_name}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{emp.email}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{emp.dept_id}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmploymentBadge(emp.employment_type)}`}>
                        {emp.employment_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{new Date(emp.start_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.archived ? 'bg-red-50 text-red-600' : 'bg-green-50 text-verified-green'}`}>
                        {emp.archived ? 'Archived' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Manager */}
      <div className="mt-6">
        <RoleManager />
      </div>
    </div>
  );
}

export default AdminDashboard;