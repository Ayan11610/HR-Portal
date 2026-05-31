import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

function CompliancePage({ user }) {
  const [vevoStatus, setVevoStatus] = useState({
    status: 'Pending',
    isEntitledToWork: false,
    visaClass: '',
    visaExpiry: '',
    workConditions: '',
    checkedAt: null
  });

  const [atoStatus, setAtoStatus] = useState({
    status: 'Pending',
    fundName: '',
    usi: '',
    checkedAt: null
  });

  const [vevoLoading, setVevoLoading] = useState(false);
  const [atoLoading, setAtoLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getEmployeeId();
  }, []);

  const getEmployeeId = async () => {
    console.log('Looking up employee for user:', user.id);
    
    const { data: empData, error } = await supabase
      .from('employees')
      .select('id, visa_required, visa_type, visa_expiry')
      .eq('user_id', user.id);

    console.log('Raw result:', empData);
    console.log('Error:', error);

    if (error) {
      console.error('Database error:', error.message);
      return;
    }

    if (empData && empData.length > 0) {
      const employee = empData[0];
      console.log('Found employee:', employee);
      setEmployeeId(employee.id);
      setProfile(employee);
      fetchComplianceStatus(employee.id);
    } else {
      console.log('No employee found — need to create profile first');
    }
  };

  const fetchComplianceStatus = async (empId) => {
    // Check VEVO status
    const { data: vevoData } = await supabase
      .from('compliance_checks')
      .select('*')
      .eq('employee_id', empId)
      .eq('check_type', 'VEVO');

    if (vevoData && vevoData.length > 0) {
      const check = vevoData[0];
      setVevoStatus({
        status: check.status,
        isEntitledToWork: check.status === 'Valid',
        visaClass: check.visa_class || '',
        visaExpiry: check.visa_expiry || '',
        workConditions: check.work_conditions || '',
        checkedAt: check.checked_at
      });
    }

    // Check ATO status
    const { data: atoData } = await supabase
      .from('compliance_checks')
      .select('*')
      .eq('employee_id', empId)
      .eq('check_type', 'ATO_SUPER');

    if (atoData && atoData.length > 0) {
      const check = atoData[0];
      setAtoStatus({
        status: check.status,
        fundName: check.fund_name || '',
        usi: check.usi || '',
        checkedAt: check.checked_at
      });
    }
  };

  // Mock VEVO API
  const mockVevoCheck = async () => {
    if (!employeeId) {
      alert('Please complete your profile first.');
      return;
    }

    setVevoLoading(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockResponse = {
      isEntitledToWork: true,
      visaClass: 'Subclass 482 (Temporary Skill Shortage)',
      visaExpiry: '2027-12-31',
      workConditions: 'No restrictive work conditions found. Must work for sponsoring employer only.'
    };

    const result = {
      employee_id: employeeId,
      check_type: 'VEVO',
      status: 'Valid',
      visa_class: mockResponse.visaClass,
      visa_expiry: mockResponse.visaExpiry,
      work_conditions: mockResponse.workConditions,
      reference_number: 'VEVO-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      checked_at: new Date().toISOString()
    };

    // Check if record exists
    const { data: existing } = await supabase
      .from('compliance_checks')
      .select('id')
      .eq('employee_id', employeeId)
      .eq('check_type', 'VEVO');

    if (existing && existing.length > 0) {
      await supabase
        .from('compliance_checks')
        .update(result)
        .eq('id', existing[0].id);
    } else {
      await supabase
        .from('compliance_checks')
        .insert([result]);
    }

    setVevoStatus({
      status: 'Valid',
      isEntitledToWork: mockResponse.isEntitledToWork,
      visaClass: mockResponse.visaClass,
      visaExpiry: mockResponse.visaExpiry,
      workConditions: mockResponse.workConditions,
      checkedAt: result.checked_at
    });

    setVevoLoading(false);
  };

  // Mock ATO API
  const mockAtoCheck = async () => {
    if (!employeeId) {
      alert('Please complete your profile first.');
      return;
    }

    setAtoLoading(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockFundName = 'AustralianSuper';
    const mockUsi = '65 714 394 898';

    const result = {
      employee_id: employeeId,
      check_type: 'ATO_SUPER',
      status: 'Valid',
      fund_name: mockFundName,
      usi: mockUsi,
      reference_number: 'ATO-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      checked_at: new Date().toISOString()
    };

    const { data: existing } = await supabase
      .from('compliance_checks')
      .select('id')
      .eq('employee_id', employeeId)
      .eq('check_type', 'ATO_SUPER');

    if (existing && existing.length > 0) {
      await supabase
        .from('compliance_checks')
        .update(result)
        .eq('id', existing[0].id);
    } else {
      await supabase
        .from('compliance_checks')
        .insert([result]);
    }

    setAtoStatus({
      status: 'Valid',
      fundName: mockFundName,
      usi: mockUsi,
      checkedAt: result.checked_at
    });

    setAtoLoading(false);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Valid':
        return 'bg-verified-green/10 text-verified-green border-verified-green/20';
      case 'Failed':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-alert-amber/10 text-alert-amber border-alert-amber/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Compliance Verification</h2>
        <p className="text-slate-600">
          Automated regulatory checks via Department of Home Affairs and Australian Taxation Office
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* VEVO Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="portal-card p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-anchor-blue/10 rounded-xl flex items-center justify-center">
                <span className="text-anchor-blue font-bold text-xl">V</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">VEVO Visa Check</h3>
                <p className="text-sm text-slate-500">Department of Home Affairs</p>
              </div>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusBadge(vevoStatus.status)}`}>
              {vevoStatus.status}
            </span>
          </div>

          {vevoStatus.status === 'Valid' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 mb-6"
            >
              <div className="p-4 bg-verified-green/10 border border-verified-green/20 rounded-xl">
                <p className="text-sm text-verified-green font-semibold mb-2">✓ Work Rights Confirmed</p>
                <p className="text-sm text-slate-700">{vevoStatus.visaClass}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Visa Expiry</p>
                  <p className="font-semibold text-slate-900">{vevoStatus.visaExpiry}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Checked At</p>
                  <p className="font-semibold text-slate-900">{vevoStatus.checkedAt ? new Date(vevoStatus.checkedAt).toLocaleDateString() : '-'}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg leading-relaxed">{vevoStatus.workConditions}</p>
            </motion.div>
          ) : (
            <div className="mb-6">
              <p className="text-sm text-slate-600 leading-relaxed">
                Verify your visa entitlements and work rights in Australia.
                {profile?.visa_required && (
                  <span className="block mt-2 text-sm text-alert-amber font-medium">
                    ⚠ Visa required: {profile.visa_type || 'Not specified'}
                  </span>
                )}
              </p>
            </div>
          )}

          <motion.button
            onClick={mockVevoCheck}
            disabled={vevoLoading || vevoStatus.status === 'Valid'}
            whileHover={{ scale: (vevoLoading || vevoStatus.status === 'Valid') ? 1 : 1.02 }}
            whileTap={{ scale: (vevoLoading || vevoStatus.status === 'Valid') ? 1 : 0.98 }}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {vevoLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying with VEVO...
              </span>
            ) : vevoStatus.status === 'Valid' ? '✓ Verified' : 'Verify Work Rights'}
          </motion.button>
        </motion.div>

        {/* ATO Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="portal-card p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-verified-green/10 rounded-xl flex items-center justify-center">
                <span className="text-verified-green font-bold text-xl">A</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">ATO Stapled Super</h3>
                <p className="text-sm text-slate-500">Australian Taxation Office</p>
              </div>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusBadge(atoStatus.status)}`}>
              {atoStatus.status}
            </span>
          </div>

          {atoStatus.status === 'Valid' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 mb-6"
            >
              <div className="p-4 bg-verified-green/10 border border-verified-green/20 rounded-xl">
                <p className="text-sm text-verified-green font-semibold mb-2">✓ Stapled Fund Confirmed</p>
                <p className="text-sm text-slate-700">{atoStatus.fundName}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">USI</p>
                <p className="font-semibold text-slate-900">{atoStatus.usi}</p>
              </div>
              <p className="text-xs text-slate-500">Checked: {atoStatus.checkedAt ? new Date(atoStatus.checkedAt).toLocaleDateString() : '-'}</p>
            </motion.div>
          ) : (
            <div className="mb-6">
              <p className="text-sm text-slate-600 leading-relaxed">
                Confirm your stapled superannuation fund to prevent duplicate accounts and fee erosion under choice-of-fund rules.
              </p>
            </div>
          )}

          <motion.button
            onClick={mockAtoCheck}
            disabled={atoLoading || atoStatus.status === 'Valid'}
            whileHover={{ scale: (atoLoading || atoStatus.status === 'Valid') ? 1 : 1.02 }}
            whileTap={{ scale: (atoLoading || atoStatus.status === 'Valid') ? 1 : 0.98 }}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {atoLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Querying ATO...
              </span>
            ) : atoStatus.status === 'Valid' ? '✓ Confirmed' : 'Find Stapled Super Fund'}
          </motion.button>
        </motion.div>
      </div>

      {/* Integration Notes */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="portal-card p-6"
      >
        <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Integration Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
          <div className="space-y-2">
            <p className="font-semibold text-slate-900 mb-2">VEVO API</p>
            <p><span className="text-slate-500">Endpoint:</span> /v1/australian-workrights</p>
            <p><span className="text-slate-500">Auth:</span> Bearer token + MTLS</p>
            <p><span className="text-slate-500">Response:</span> isEntitledToWork, visaClass, visaExpiry</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-slate-900 mb-2">ATO DSP API</p>
            <p><span className="text-slate-500">Endpoint:</span> /stapled-super-fund/request</p>
            <p><span className="text-slate-500">Auth:</span> X-ATO-Product-ID + Client Certificates</p>
            <p><span className="text-slate-500">Response:</span> stapledSuperFundDetails.fundName, USI</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CompliancePage;
