import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Layout({ user, onLogout, children }) {
  const location = useLocation();
  const [userRole, setUserRole] = useState('Onboardee');

  useEffect(() => {
    const fetchUserRole = async () => {
      console.log('Fetching role for user:', user.id);

      const { data, error } = await supabase
        .from('user_roles')
        .select('role_name')
        .eq('user_id', user.id)
        .single();

      console.log('Role query result:', data);
      console.log('Role query error:', error);

      if (data) {
        console.log('Setting role to:', data.role_name);
        setUserRole(data.role_name);
      } else {
        console.log('No role found, defaulting to Onboardee');
        setUserRole('Onboardee');
      }
    };

    fetchUserRole();
  }, [user.id]);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'D', roles: ['Onboardee', 'Hiring_Manager', 'HR_Admin', 'IT_Staff', 'Payroll_Officer'] },
    { path: '/profile', label: 'My Profile', icon: 'P', roles: ['Onboardee'] },
    { path: '/documents', label: 'Documents', icon: 'F', roles: ['Onboardee'] },
    { path: '/compliance', label: 'Compliance', icon: 'C', roles: ['Onboardee'] },
    { path: '/audit', label: 'Audit Trail', icon: 'A', roles: ['Onboardee', 'HR_Admin', 'Payroll_Officer'] },
    { path: '/admin', label: 'HR Admin', icon: 'H', roles: ['HR_Admin'] },
    { path: '/uploads', label: 'Uploads', icon: 'U', roles: ['Onboardee'] },
    { path: '/manager', label: 'My Team', icon: 'M', roles: ['Hiring_Manager'] },
    { path: '/it', label: 'IT Tasks', icon: 'I', roles: ['IT_Staff'] },
    { path: '/payroll', label: 'Payroll', icon: '$', roles: ['Payroll_Officer'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(userRole));

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
    <div className="min-h-screen flex flex-col bg-sky-wash">
      {/* Top Header */}
      <header className="bg-portal-navy text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-portal-navy font-bold text-sm">HR</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-wide">Australian Employee Onboarding</h1>
              <p className="text-xs text-blue-200">HR Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(userRole)}`}>
              {userRole.replace('_', ' ')}
            </span>
            <span className="text-xs text-blue-200">{user.email}</span>
            <button onClick={onLogout} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout with Sidebar */}
      <div className="flex-1 max-w-7xl mx-auto w-full flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white border-r border-light-border flex-shrink-0">
          <div className="p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Navigation</p>
            <ul className="space-y-1">
              {filteredNav.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition ${
                      location.pathname === item.path
                        ? 'bg-portal-navy text-white'
                        : 'text-slate-600 hover:bg-sky-wash'
                    }`}
                  >
                    <span className="w-6 h-6 rounded bg-current/10 flex items-center justify-center text-xs font-bold">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 border-t border-light-border mt-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Compliance</p>
            <div className="text-xs text-slate-500 space-y-1">
              <p>Privacy Act 1988</p>
              <p>Fair Work Act 2009</p>
              <p className="text-alert-amber font-medium">7-Year Retention</p>
            </div>
          </div>

          <div className="p-4 border-t border-light-border">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Data Residency</p>
            <p className="text-xs text-slate-500">AWS Sydney</p>
            <p className="text-xs text-slate-500">ap-southeast-2</p>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-charcoal text-slate-400 text-xs py-3 px-6 text-center">
        <p>Data Residency: AWS Sydney (ap-southeast-2) | Compliant with Privacy Act 1988 and Fair Work Act 2009</p>
      </footer>
    </div>
  );
}

export default Layout;