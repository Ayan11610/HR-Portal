import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Premium Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">HR</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white tracking-tight">HR Portal</h1>
              <p className="text-xs text-slate-400">Australian Onboarding</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3"
          >
            <Link to="/" className="text-sm text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-all duration-300 font-medium">
              Sign In
            </Link>
            <Link to="/register" className="text-sm bg-white hover:bg-slate-100 text-black px-5 py-2 rounded-lg transition-all duration-300 font-medium">
              Get Started
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Enterprise Onboarding
              <span className="block text-anchor-blue mt-2">Simplified</span>
            </h2>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Streamline payroll validation, tax declarations, and compliance verification within a secure, auditable environment.
            </p>
            <div className="flex gap-4">
              <Link to="/register" className="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-all duration-300 transform hover:scale-105">
                Start Onboarding
              </Link>
              <Link to="/" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300">
                Employee Sign In
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-4 bg-white/10 rounded-xl p-5"
                >
                  <div className="w-12 h-12 bg-verified-green rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold">Account Verified</p>
                    <p className="text-sm text-slate-300">Secure authentication complete</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-4 bg-white/10 rounded-xl p-5"
                >
                  <div className="w-12 h-12 bg-anchor-blue rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <div>
                    <p className="font-semibold">Profile Complete</p>
                    <p className="text-sm text-slate-300">Details saved securely</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-4 bg-white/10 rounded-xl p-5"
                >
                  <div className="w-12 h-12 bg-alert-amber rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <div>
                    <p className="font-semibold">Compliance Pending</p>
                    <p className="text-sm text-slate-300">VEVO verification required</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Enterprise Compliance</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">Built for Australian regulations with security at the core</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="portal-card p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white font-bold text-2xl">🔒</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-lg mb-3">AES-256 Encryption</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Tax File Numbers and bank details encrypted at rest with automatic key rotation.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="portal-card p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-verified-green rounded-xl flex items-center justify-center mb-6">
                <span className="text-white font-bold text-2xl">✓</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-lg mb-3">Automated Compliance</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Native VEVO visa verification and ATO stapled super fund lookups with real-time tracking.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="portal-card p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-alert-amber rounded-xl flex items-center justify-center mb-6">
                <span className="text-white font-bold text-xl">7Y</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-lg mb-3">7-Year Audit Retention</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Immutable append-only logs satisfying Fair Work Act 2009 requirements.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Data Residency Section */}
      <section className="bg-white py-20 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Australian Data Residency</h3>
            <p className="text-slate-600 max-w-2xl mx-auto mb-12">
              All employee data hosted exclusively within Australian borders. AWS Sydney (ap-southeast-2) with IRAP assessment.
            </p>
            <div className="flex justify-center gap-12 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-verified-green rounded-full animate-pulse"></div>
                <span className="text-slate-700 font-medium">AWS Sydney</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-anchor-blue rounded-full animate-pulse"></div>
                <span className="text-slate-700 font-medium">ap-southeast-2</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-alert-amber rounded-full animate-pulse"></div>
                <span className="text-slate-700 font-medium">ISO 27001 Certified</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-2">
          <p>Data Residency: AWS Sydney (ap-southeast-2) | Compliant with Privacy Act 1988 and Fair Work Act 2009</p>
          <p className="text-slate-500">© 2026 Australian Employee Onboarding Portal. Capstone Project ICT304.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
