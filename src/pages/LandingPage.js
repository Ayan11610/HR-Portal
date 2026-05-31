import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-sky-wash">
      {/* Hero Section */}
      <header className="bg-portal-navy text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center animate-pulse">
              <span className="text-portal-navy font-bold text-sm">HR</span>
            </div>
            <h1 className="text-sm font-semibold tracking-wide">Australian Employee Onboarding and HR Portal</h1>
          </div>
          <div className="flex gap-4">
            <Link to="/" className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition duration-300">
              Sign In
            </Link>
            <Link to="/register" className="text-sm bg-white hover:bg-sky-wash text-portal-navy px-4 py-2 rounded transition duration-300 font-medium">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <section className="bg-portal-navy text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Streamlined Employee Onboarding for Australian Enterprises
            </h2>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Digitalize payroll validation, tax declarations, superannuation nominations, and compliance verification within a secure, auditable environment. Built for the Fair Work Act 2009 and Privacy Act 1988.
            </p>
            <div className="flex gap-4">
              <Link to="/register" className="bg-white text-portal-navy px-6 py-3 rounded-md font-semibold hover:bg-sky-wash transition duration-300 shadow-lg">
                Start Onboarding
              </Link>
              <Link to="/" className="border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white/10 transition duration-300">
                Employee Sign In
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 animate-fade-in delay-200">
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4 animate-slide-in-right delay-300">
                  <div className="w-10 h-10 bg-verified-green rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Account Verified</p>
                    <p className="text-xs text-blue-200">Secure authentication complete</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4 animate-slide-in-right delay-500">
                  <div className="w-10 h-10 bg-portal-navy rounded-full flex items-center justify-center border border-white/30">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Profile Complete</p>
                    <p className="text-xs text-blue-200">Personal and financial details saved</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4 animate-slide-in-right delay-700">
                  <div className="w-10 h-10 bg-alert-amber rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Compliance Pending</p>
                    <p className="text-xs text-blue-200">VEVO and ATO verification required</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold text-charcoal text-center mb-12">Enterprise Compliance Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="portal-card p-6 hover:shadow-lg transition duration-300 animate-fade-in-up delay-100">
              <div className="w-12 h-12 bg-portal-navy/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-portal-navy font-bold text-lg">🔒</span>
              </div>
              <h4 className="font-semibold text-charcoal mb-2">AES-256 Encryption</h4>
              <p className="text-sm text-slate-600">Tax File Numbers and bank details encrypted at rest using pgcrypto with automatic key rotation.</p>
            </div>
            <div className="portal-card p-6 hover:shadow-lg transition duration-300 animate-fade-in-up delay-200">
              <div className="w-12 h-12 bg-verified-green/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-verified-green font-bold text-lg">✓</span>
              </div>
              <h4 className="font-semibold text-charcoal mb-2">Automated Compliance</h4>
              <p className="text-sm text-slate-600">Native VEVO visa verification and ATO stapled super fund lookups with real-time status tracking.</p>
            </div>
            <div className="portal-card p-6 hover:shadow-lg transition duration-300 animate-fade-in-up delay-300">
              <div className="w-12 h-12 bg-alert-amber/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-alert-amber font-bold text-lg">7Y</span>
              </div>
              <h4 className="font-semibold text-charcoal mb-2">7-Year Audit Retention</h4>
              <p className="text-sm text-slate-600">Immutable append-only logs satisfying Section 535 of the Fair Work Act 2009 and Privacy Act requirements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Residency Section */}
      <section className="bg-white py-16 px-6 border-t border-light-border">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-charcoal mb-4">Australian Data Residency</h3>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8">
            All employee metadata, financial indicators, and work rights documents are hosted exclusively within Australian borders. AWS Sydney (ap-southeast-2) with IRAP assessment.
          </p>
          <div className="flex justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-verified-green rounded-full animate-pulse"></div>
              <span>AWS Sydney</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-portal-navy rounded-full animate-pulse delay-100"></div>
              <span>ap-southeast-2</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-alert-amber rounded-full animate-pulse delay-200"></div>
              <span>ISO 27001 Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal text-slate-400 text-xs py-6 px-6 text-center">
        <p className="mb-2">Data Residency: AWS Sydney (ap-southeast-2) | Compliant with Privacy Act 1988 and Fair Work Act 2009</p>
        <p>© 2026 Australian Employee Onboarding Portal. Capstone Project ICT304.</p>
      </footer>
    </div>
  );
}

export default LandingPage;