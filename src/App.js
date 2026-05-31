import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Layout from './components/Layout';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import DocumentsPage from './pages/DocumentsPage';
import CompliancePage from './pages/CompliancePage';
import AuditPage from './pages/AuditPage';
import AdminDashboard from './pages/AdminDashboard';
import UploadsPage from './pages/UploadsPage';
import HiringManagerDashboard from './pages/HiringManagerDashboard';
import ITStaffDashboard from './pages/ITStaffDashboard';
import PayrollOfficerDashboard from './pages/PayrollOfficerDashboard';
import LandingPage from './pages/LandingPage';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {<Route path="/landing" element={<LandingPage />} />}
        <Route path="/register" element={
          !user ? (
            <div className="min-h-screen flex flex-col bg-slate-50">
              <header className="bg-slate-900 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                    <span className="text-slate-900 font-bold text-sm">HR</span>
                  </div>
                  <h1 className="text-lg font-semibold tracking-wide">Australian Employee Onboarding and HR Portal</h1>
                </div>
              </header>
              <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                  <SignUp />
                  <p className="text-center mt-4 text-sm text-slate-600">
                    Already registered?{' '}
                    <a href="/" className="text-anchor-blue hover:text-blue-700 font-medium underline">Sign In</a>
                  </p>
                </div>
              </main>
              <footer className="bg-slate-900 text-slate-400 text-xs py-3 px-6 text-center">
                <p>Data Residency: AWS Sydney (ap-southeast-2) | Compliant with Privacy Act 1988 and Fair Work Act 2009</p>
              </footer>
            </div>
          ) : <Navigate to="/dashboard" replace />
        } />

        <Route path="/" element={
          !user ? (
            <div className="min-h-screen flex flex-col bg-slate-50">
              <header className="bg-slate-900 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                    <span className="text-slate-900 font-bold text-sm">HR</span>
                  </div>
                  <h1 className="text-lg font-semibold tracking-wide">Australian Employee Onboarding and HR Portal</h1>
                </div>
              </header>
              <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                  <SignIn onLogin={setUser} />
                  <p className="text-center mt-4 text-sm text-slate-600">
                    New employee?{' '}
                    <a href="/register" className="text-anchor-blue hover:text-blue-700 font-medium underline">Register Account</a>
                  </p>
                </div>
              </main>
              <footer className="bg-slate-900 text-slate-400 text-xs py-3 px-6 text-center">
                <p>Data Residency: AWS Sydney (ap-southeast-2) | Compliant with Privacy Act 1988 and Fair Work Act 2009</p>
              </footer>
            </div>
          ) : <Navigate to="/dashboard" replace />
        } />

        {/* Protected Routes - With Layout */}
        <Route path="/dashboard" element={
          user ? <Layout user={user} onLogout={handleLogout}><DashboardPage user={user} /></Layout> : <Navigate to="/" replace />
        } />
        <Route path="/profile" element={
          user ? <Layout user={user} onLogout={handleLogout}><ProfilePage user={user} /></Layout> : <Navigate to="/" replace />
        } />
        <Route path="/documents" element={
          user ? <Layout user={user} onLogout={handleLogout}><DocumentsPage user={user} /></Layout> : <Navigate to="/" replace />
        } />
        <Route path="/compliance" element={
          user ? <Layout user={user} onLogout={handleLogout}><CompliancePage user={user} /></Layout> : <Navigate to="/" replace />
        } />
        <Route path="/audit" element={
          user ? <Layout user={user} onLogout={handleLogout}><AuditPage user={user} /></Layout> : <Navigate to="/" replace />
        } />
        <Route path="/admin" element={
          user ? <Layout user={user} onLogout={handleLogout}><AdminDashboard user={user} /></Layout> : <Navigate to="/" replace />
        } />
        <Route path="/uploads" element={
          user ? <Layout user={user} onLogout={handleLogout}><UploadsPage user={user} /></Layout> : <Navigate to="/" replace />
        } />
        <Route path="/manager" element={
          user ? <Layout user={user} onLogout={handleLogout}><HiringManagerDashboard user={user} /></Layout> : <Navigate to="/" replace />
        } />
         <Route path="/it" element={
          user ? <Layout user={user} onLogout={handleLogout}><ITStaffDashboard user={user} /></Layout> : <Navigate to="/" replace />
        } />
         <Route path="/payroll" element={
          user ? <Layout user={user} onLogout={handleLogout}><PayrollOfficerDashboard user={user} /></Layout> : <Navigate to="/" replace />
        } />
      </Routes>
        
    </Router>
  );
}

export default App;