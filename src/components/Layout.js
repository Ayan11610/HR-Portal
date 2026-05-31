import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

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
    { path: '/dashboard', label: 'Dashboard', icon: '◆', roles: ['Onboardee', 'Hiring_Manager', 'HR_Admin', 'IT_Staff', 'Payroll_Officer'] },
    { path: '/profile', label: 'Profile', icon: '●', roles: ['Onboardee'] },
    { path: '/documents', label: 'Documents', icon: '▪', roles: ['Onboardee'] },
    { path: '/compliance', label: 'Compliance', icon: '✓', roles: ['Onboardee'] },
    { path: '/audit', label: 'Audit Trail', icon: '◉', roles: ['Onboardee', 'HR_Admin', 'Payroll_Officer'] },
    { path: '/admin', label: 'HR Admin', icon: '★', roles: ['HR_Admin'] },
    { path: '/uploads', label: 'Uploads', icon: '↑', roles: ['Onboardee'] },
    { path: '/manager', label: 'My Team', icon: '◈', roles: ['Hiring_Manager'] },
    { path: '/it', label: 'IT Tasks', icon: '⚙', roles: ['IT_Staff'] },
    { path: '/payroll', label: 'Payroll', icon: '$', roles: ['Payroll_Officer'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(userRole));

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'HR_Admin': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Hiring_Manager': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Onboardee': return 'bg-verified-green/10 text-verified-green border-verified-green/20';
      case 'IT_Staff': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Payroll_Officer': return 'bg-pink-50 text-pink-700 border-pink-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Slim Dark Sidebar */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-64 bg-slate-900 flex-shrink-0 flex flex-col sticky top-0 h-screen"
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-slate-900 font-bold text-lg">HR</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white tracking-tight">HR Portal</h1>
              <p className="text-xs text-slate-400">Australian Onboarding</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">Navigation</p>
          <ul className="space-y-1">
            {filteredNav.map((item) => (
              <motion.li 
                key={item.path}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-anchor-blue text-white shadow-lg shadow-anchor-blue/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-base opacity-80">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Compliance Info */}
        <div className="p-4 border-t border-slate-800">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Compliance</p>
          <div className="text-xs text-slate-400 space-y-1">
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-verified-green rounded-full"></span>
              Privacy Act 1988
            </p>
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-verified-green rounded-full"></span>
              Fair Work Act 2009
            </p>
            <p className="flex items-center gap-2 text-alert-amber">
              <span className="w-1.5 h-1.5 bg-alert-amber rounded-full"></span>
              7-Year Retention
            </p>
          </div>
        </div>

        {/* Data Residency */}
        <div className="p-4 border-t border-slate-800">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Data Residency</p>
          <div className="text-xs text-slate-400 space-y-1">
            <p>AWS Sydney</p>
            <p className="text-slate-500">ap-southeast-2</p>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(userRole)}`}>
                {userRole.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 font-medium">{user.email}</span>
              <button 
                onClick={onLogout} 
                className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 p-8 overflow-auto"
        >
          {children}
        </motion.main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 text-xs py-4 px-8 border-t border-slate-800">
          <p className="text-center">Data Residency: AWS Sydney (ap-southeast-2) | Compliant with Privacy Act 1988 and Fair Work Act 2009</p>
        </footer>
      </div>
    </div>
  );
}

export default Layout;
