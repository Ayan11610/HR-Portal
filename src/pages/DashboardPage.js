import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

function DashboardPage({ user }) {
  const [progress, setProgress] = useState({
    profileComplete: false,
    documentsAcknowledged: 0,
    totalDocuments: 3,
    vevoStatus: 'Pending',
    atoStatus: 'Pending',
    overallPercent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    // Check if profile exists
    const { data: empData } = await supabase
      .from('employees')
      .select('id, full_name, employment_type')
      .eq('user_id', user.id)
      .single();

    const hasProfile = !!empData;

    // Check documents acknowledged
    let docsAcknowledged = 0;
    if (empData) {
      const { data: docData } = await supabase
        .from('policy_acknowledgments')
        .select('*')
        .eq('employee_id', empData.id);

      if (docData) {
        docsAcknowledged = docData.filter(d => d.acknowledged_at !== null).length;
      }
    }

    // Check compliance status from compliance_checks table
    let vevoStatus = 'Pending';
    let atoStatus = 'Pending';

    if (empData) {
      const { data: compData } = await supabase
        .from('compliance_checks')
        .select('*')
        .eq('employee_id', empData.id);

      if (compData && compData.length > 0) {
        compData.forEach(check => {
          if (check.check_type === 'VEVO') vevoStatus = check.status;
          if (check.check_type === 'ATO_SUPER') atoStatus = check.status;
        });
      }
    }

    // Calculate overall percentage
    let percent = 0;
    if (hasProfile) percent += 20;
    percent += (docsAcknowledged / 3) * 40;
    if (vevoStatus === 'Valid') percent += 20;
    if (atoStatus === 'Valid') percent += 20;

    setProgress({
      profileComplete: hasProfile,
      documentsAcknowledged: docsAcknowledged,
      totalDocuments: 3,
      vevoStatus,
      atoStatus,
      overallPercent: Math.round(percent)
    });

    setLoading(false);
  };

  const getStatusColor = (status) => {
    if (status === 'Valid' || status === true) return 'text-verified-green bg-verified-green/10 border-verified-green/20';
    if (status === 'Failed') return 'text-red-600 bg-red-50 border-red-200';
    return 'text-alert-amber bg-alert-amber/10 border-alert-amber/20';
  };

  const getStatusText = (status) => {
    if (status === 'Valid' || status === true) return 'Complete';
    if (status === 'Failed') return 'Failed';
    return 'Pending';
  };

  const steps = [
    {
      number: 1,
      title: 'Account Registration',
      description: 'Your account has been successfully registered and authenticated.',
      status: true,
      path: null,
      locked: false
    },
    {
      number: 2,
      title: 'Personal Profile',
      description: 'Complete your employment and financial details.',
      status: progress.profileComplete,
      path: '/profile',
      locked: false
    },
    {
      number: 3,
      title: 'Document Review',
      description: `Read and acknowledge all required workplace policies. (${progress.documentsAcknowledged}/${progress.totalDocuments} completed)`,
      status: progress.documentsAcknowledged === progress.totalDocuments,
      path: '/documents',
      locked: !progress.profileComplete
    },
    {
      number: 4,
      title: 'Compliance Verification',
      description: 'Verify work rights via VEVO and confirm ATO stapled super fund.',
      status: progress.vevoStatus === 'Valid' && progress.atoStatus === 'Valid',
      path: '/compliance',
      locked: progress.documentsAcknowledged < progress.totalDocuments
    },
    {
      number: 5,
      title: 'Final Review',
      description: 'HR will review your submission and finalize your onboarding.',
      status: progress.overallPercent === 100,
      path: '/audit',
      locked: !(progress.vevoStatus === 'Valid' && progress.atoStatus === 'Valid')
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-portal-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-light-border">
        <h2 className="text-xl font-bold text-charcoal">Welcome to Your Onboarding Portal</h2>
        <p className="text-sm text-slate-500 mt-1">
          Complete the steps below to finalize your employment setup. 
          Data is stored securely in Australian data centers.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="portal-card p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-charcoal">Overall Progress</h3>
          <span className="text-2xl font-bold text-portal-navy">{progress.overallPercent}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
          <div 
            className="bg-portal-navy h-3 rounded-full transition-all duration-500" 
            style={{ width: `${progress.overallPercent}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-500">
          {progress.overallPercent === 100 
            ? 'All steps completed! HR will review your submission.' 
            : `${5 - Math.ceil((progress.overallPercent / 100) * 5)} steps remaining`}
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((step) => (
          <div 
            key={step.number}
            className={`portal-card p-5 ${step.locked ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                step.status 
                  ? 'bg-verified-green/10' 
                  : step.locked 
                    ? 'bg-slate-100' 
                    : 'bg-alert-amber/10'
              }`}>
                <span className={`font-bold text-sm ${
                  step.status 
                    ? 'text-verified-green' 
                    : step.locked 
                      ? 'text-slate-400' 
                      : 'text-alert-amber'
                }`}>
                  {step.status ? '✓' : step.number}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-charcoal text-sm">{step.title}</h3>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(step.status)}`}>
                  {getStatusText(step.status)}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-3">{step.description}</p>
            {step.path && !step.locked && (
              <Link 
                to={step.path}
                className="inline-block text-xs text-anchor-blue hover:text-blue-700 font-medium underline"
              >
                Go to {step.title} →
              </Link>
            )}
            {step.locked && (
              <p className="text-xs text-slate-400">Complete previous steps to unlock</p>
            )}
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="portal-card p-4">
          <p className="text-xs text-slate-500 mb-1">Profile Status</p>
          <p className={`text-sm font-semibold ${progress.profileComplete ? 'text-verified-green' : 'text-alert-amber'}`}>
            {progress.profileComplete ? 'Complete' : 'Incomplete'}
          </p>
        </div>
        <div className="portal-card p-4">
          <p className="text-xs text-slate-500 mb-1">Documents Acknowledged</p>
          <p className="text-sm font-semibold text-charcoal">
            {progress.documentsAcknowledged} / {progress.totalDocuments}
          </p>
        </div>
        <div className="portal-card p-4">
          <p className="text-xs text-slate-500 mb-1">Compliance Checks</p>
          <p className="text-sm font-semibold text-charcoal">
            VEVO: <span className={progress.vevoStatus === 'Valid' ? 'text-verified-green' : 'text-alert-amber'}>{progress.vevoStatus}</span>
            {' | '}
            ATO: <span className={progress.atoStatus === 'Valid' ? 'text-verified-green' : 'text-alert-amber'}>{progress.atoStatus}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;