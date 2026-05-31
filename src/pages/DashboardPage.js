import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    if (status === 'Valid' || status === true) return 'bg-verified-green/10 text-verified-green border-verified-green/20';
    if (status === 'Failed') return 'bg-red-50 text-red-600 border-red-200';
    return 'bg-alert-amber/10 text-alert-amber border-alert-amber/20';
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
        <div className="shimmer-effect w-full h-full rounded-xl"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Onboarding Dashboard</h2>
        <p className="text-slate-600">Complete the steps below to finalize your employment setup</p>
      </div>

      {/* Progress Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="portal-card p-8 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Overall Progress</h3>
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="text-4xl font-bold text-anchor-blue"
          >
            {progress.overallPercent}%
          </motion.span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 mb-3 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress.overallPercent}%` }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="bg-gradient-to-r from-anchor-blue to-verified-green h-3 rounded-full"
          ></motion.div>
        </div>
        <p className="text-sm text-slate-600">
          {progress.overallPercent === 100 
            ? '✓ All steps completed! HR will review your submission.' 
            : `${5 - Math.ceil((progress.overallPercent / 100) * 5)} steps remaining`}
        </p>
      </motion.div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {steps.map((step, index) => (
          <motion.div 
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -4 }}
            className={`portal-card p-6 ${step.locked ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start gap-4 mb-4">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  step.status 
                    ? 'bg-verified-green' 
                    : step.locked 
                      ? 'bg-slate-200' 
                      : 'bg-alert-amber'
                }`}
              >
                <span className={`font-bold text-lg ${
                  step.status || !step.locked ? 'text-white' : 'text-slate-400'
                }`}>
                  {step.status ? '✓' : step.number}
                </span>
              </motion.div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(step.status)}`}>
                  {getStatusText(step.status)}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">{step.description}</p>
            {step.path && !step.locked && (
              <Link 
                to={step.path}
                className="inline-flex items-center text-sm text-anchor-blue hover:text-[#2574A9] font-medium transition-colors duration-300"
              >
                Go to {step.title} →
              </Link>
            )}
            {step.locked && (
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <span>🔒</span> Complete previous steps to unlock
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="portal-card p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Profile Status</p>
          <p className={`text-xl font-bold ${progress.profileComplete ? 'text-verified-green' : 'text-alert-amber'}`}>
            {progress.profileComplete ? '✓ Complete' : '○ Incomplete'}
          </p>
        </div>
        <div className="portal-card p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Documents Acknowledged</p>
          <p className="text-xl font-bold text-slate-900">
            {progress.documentsAcknowledged} / {progress.totalDocuments}
          </p>
        </div>
        <div className="portal-card p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Compliance Checks</p>
          <div className="flex gap-4 text-sm font-medium">
            <span className={progress.vevoStatus === 'Valid' ? 'text-verified-green' : 'text-alert-amber'}>
              VEVO: {progress.vevoStatus}
            </span>
            <span className={progress.atoStatus === 'Valid' ? 'text-verified-green' : 'text-alert-amber'}>
              ATO: {progress.atoStatus}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DashboardPage;
