import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function RoleManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // Get employees (which we can read via RLS)
    const { data: empData, error: empError } = await supabase
      .from('employees')
      .select('id, user_id, full_name, email, employment_type');

    // Get roles
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('user_id, role_name');

    // Combine
    const combined = (empData || []).map(emp => {
      const role = roleData?.find(r => r.user_id === emp.user_id);
      return {
        id: emp.user_id,
        employee_id: emp.id,
        full_name: emp.full_name,
        email: emp.email,
        role: role?.role_name || 'Onboardee',
        employment_type: emp.employment_type
      };
    });

    setUsers(combined);
    setLoading(false);
  };

  const handleRoleChange = async (userId, newRole) => {
    setMessage('');
    setMessageType('');

    const { error } = await supabase
      .from('user_roles')
      .upsert({ user_id: userId, role_name: newRole }, { onConflict: 'user_id' });

    if (error) {
      setMessage('Error: ' + error.message);
      setMessageType('error');
    } else {
      setMessage('Role updated to ' + newRole.replace('_', ' ') + '. User must re-login to see changes.');
      setMessageType('success');
      fetchUsers();
    }
  };

  const roles = ['Onboardee', 'Hiring_Manager', 'HR_Admin', 'IT_Staff', 'Payroll_Officer'];

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'HR_Admin': return 'bg-purple-100 text-purple-700';
      case 'Hiring_Manager': return 'bg-blue-100 text-blue-700';
      case 'Onboardee': return 'bg-green-100 text-verified-green';
      case 'IT_Staff': return 'bg-orange-100 text-orange-700';
      case 'Payroll_Officer': return 'bg-pink-100 text-pink-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-light-border">
        <h2 className="text-xl font-bold text-charcoal">Role-Based Access Control</h2>
        <p className="text-sm text-slate-500 mt-1">
          Assign roles to users. This controls what each user can see and do in the portal.
        </p>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md text-sm ${
          messageType === 'success' 
            ? 'bg-green-50 text-verified-green border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <div className="portal-card overflow-hidden">
        <div className="p-4 border-b border-light-border">
          <h3 className="font-semibold text-charcoal">User Roles</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-light-border">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">User</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Email</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Current Role</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Assign New Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-sm text-slate-500">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-sm text-slate-500">No users found. Users must complete their profile first.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-charcoal">{u.full_name}</p>
                      <p className="text-xs text-slate-400">{u.id.substring(0, 8)}...</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(u.role)}`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="text-sm border border-light-border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-portal-navy"
                      >
                        {roles.map(role => (
                          <option key={role} value={role}>{role.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 portal-card p-4">
        <h4 className="text-sm font-semibold text-charcoal mb-2">Role Permissions (Table 3.1)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div>
            <p className="font-medium text-slate-700">HR_Admin</p>
            <p>Full system access. Manage all employees, configure workflows, generate reports.</p>
          </div>
          <div>
            <p className="font-medium text-slate-700">Hiring_Manager</p>
            <p>Department-scoped. View direct reports, assign buddies, approve tasks.</p>
          </div>
          <div>
            <p className="font-medium text-slate-700">Onboardee</p>
            <p>Restricted. Complete checklist, upload documents, view policies, track progress.</p>
          </div>
          <div>
            <p className="font-medium text-slate-700">IT_Staff</p>
            <p>Task-only. Receive equipment requests, manage system access.</p>
          </div>
          <div>
            <p className="font-medium text-slate-700">Payroll_Officer</p>
            <p>Financial records. View TFN declarations, update bank details, run pay reports.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleManager;