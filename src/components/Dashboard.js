import React from 'react';

function DashboardPage({ user }) {
  return (
    <div>
      <div className="mb-6 pb-4 border-b border-light-border">
        <h2 className="text-xl font-bold text-charcoal">Welcome to Your Onboarding Portal</h2>
        <p className="text-sm text-slate-500 mt-1">Complete the steps below to finalize your employment setup.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Progress Cards */}
        <div className="portal-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-verified-green/10 rounded-full flex items-center justify-center">
              <span className="text-verified-green font-bold text-sm">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal text-sm">Account Created</h3>
              <p className="text-xs text-verified-green">Complete</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Your account has been successfully registered and authenticated.</p>
        </div>

        <div className="portal-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-alert-amber/10 rounded-full flex items-center justify-center">
              <span className="text-alert-amber font-bold text-sm">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal text-sm">Personal Profile</h3>
              <p className="text-xs text-alert-amber">Pending</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Complete your personal details, banking, and tax information.</p>
        </div>

        <div className="portal-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-alert-amber/10 rounded-full flex items-center justify-center">
              <span className="text-alert-amber font-bold text-sm">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal text-sm">Document Review</h3>
              <p className="text-xs text-alert-amber">Pending</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Read and acknowledge all required workplace policies.</p>
        </div>

        <div className="portal-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-alert-amber/10 rounded-full flex items-center justify-center">
              <span className="text-alert-amber font-bold text-sm">4</span>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal text-sm">Compliance Verification</h3>
              <p className="text-xs text-alert-amber">Pending</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Verify work rights via VEVO and confirm ATO stapled super fund.</p>
        </div>

        <div className="portal-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-alert-amber/10 rounded-full flex items-center justify-center">
              <span className="text-alert-amber font-bold text-sm">5</span>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal text-sm">Final Review</h3>
              <p className="text-xs text-alert-amber">Pending</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">HR will review your submission and finalize your onboarding.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 portal-card p-5">
        <h3 className="font-semibold text-charcoal mb-3">Your Progress Overview</h3>
        <div className="w-full bg-slate-200 rounded-full h-2.5 mb-2">
          <div className="bg-portal-navy h-2.5 rounded-full" style={{ width: '20%' }}></div>
        </div>
        <p className="text-xs text-slate-500">20% Complete - 1 of 5 steps finished</p>
      </div>
    </div>
  );
}

export default DashboardPage;