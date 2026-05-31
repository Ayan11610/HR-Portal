import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

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
    
    // Don't use .single() — it throws error if no rows. Use .maybeSingle() or check array
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
      // Don't show alert here, let the button handler show it
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
        return 'bg-verified-green/10 text-verified-green border border-verified-green/20';
      case 'Failed':
        return 'bg-red-50 text-red-600 border border-red-200';
      default:
        return 'bg-alert-amber/10 text-alert-amber border border-alert-amber/20';
    }
  };

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-light-border">
        <h2 className="text-xl font-bold text-charcoal">Compliance Verification</h2>
        <p className="text-sm text-slate-500 mt-1">
          Automated regulatory checks via Department of Home Affairs and Australian Taxation Office.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VEVO Card */}
        <div className="portal-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-portal-navy/10 rounded-lg flex items-center justify-center">
                <span className="text-portal-navy font-bold text-sm">V</span>
              </div>
              <div>
                <h3 className="font-semibold text-charcoal">VEVO Visa Check</h3>
                <p className="text-xs text-slate-500">Department of Home Affairs</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(vevoStatus.status)}`}>
              {vevoStatus.status}
            </span>
          </div>

          {vevoStatus.status === 'Valid' ? (
            <div className="space-y-3 mb-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-xs text-verified-green font-medium mb-1">Work Rights Confirmed</p>
                <p className="text-xs text-slate-600">{vevoStatus.visaClass}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-500">Visa Expiry</p>
                  <p className="font-medium text-charcoal">{vevoStatus.visaExpiry}</p>
                </div>
                <div>
                  <p className="text-slate-500">Checked At</p>
                  <p className="font-medium text-charcoal">{vevoStatus.checkedAt ? new Date(vevoStatus.checkedAt).toLocaleDateString() : '-'}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded">{vevoStatus.workConditions}</p>
            </div>
          ) : (
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-3">
                Verify your visa entitlements and work rights in Australia.
                {profile?.visa_required && (
                  <span className="block mt-1 text-xs text-alert-amber">
                    Visa required: {profile.visa_type || 'Not specified'}
                  </span>
                )}
              </p>
            </div>
          )}

          <button
            onClick={mockVevoCheck}
            disabled={vevoLoading || vevoStatus.status === 'Valid'}
            className="w-full py-2.5 px-4 bg-portal-navy hover:bg-blue-700 text-white font-medium rounded-md transition disabled:opacity-50"
          >
            {vevoLoading ? 'Verifying with VEVO...' : vevoStatus.status === 'Valid' ? 'Verified' : 'Verify Work Rights'}
          </button>
        </div>

        {/* ATO Card */}
        <div className="portal-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-portal-navy/10 rounded-lg flex items-center justify-center">
                <span className="text-portal-navy font-bold text-sm">A</span>
              </div>
              <div>
                <h3 className="font-semibold text-charcoal">ATO Stapled Super</h3>
                <p className="text-xs text-slate-500">Australian Taxation Office</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(atoStatus.status)}`}>
              {atoStatus.status}
            </span>
          </div>

          {atoStatus.status === 'Valid' ? (
            <div className="space-y-3 mb-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-xs text-verified-green font-medium mb-1">Stapled Fund Confirmed</p>
                <p className="text-xs text-slate-600">{atoStatus.fundName}</p>
              </div>
              <div className="text-xs">
                <p className="text-slate-500">USI</p>
                <p className="font-medium text-charcoal">{atoStatus.usi}</p>
              </div>
              <p className="text-xs text-slate-500">Checked: {atoStatus.checkedAt ? new Date(atoStatus.checkedAt).toLocaleDateString() : '-'}</p>
            </div>
          ) : (
            <div className="mb-4">
              <p className="text-sm text-slate-600">
                Confirm your stapled superannuation fund to prevent duplicate accounts and fee erosion under choice-of-fund rules.
              </p>
            </div>
          )}

          <button
            onClick={mockAtoCheck}
            disabled={atoLoading || atoStatus.status === 'Valid'}
            className="w-full py-2.5 px-4 bg-portal-navy hover:bg-blue-700 text-white font-medium rounded-md transition disabled:opacity-50"
          >
            {atoLoading ? 'Querying ATO...' : atoStatus.status === 'Valid' ? 'Confirmed' : 'Find Stapled Super Fund'}
          </button>
        </div>
      </div>

      {/* Integration Notes */}
      <div className="mt-6 portal-card p-4">
        <h4 className="text-sm font-semibold text-charcoal mb-2">Integration Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div>
            <p className="font-medium text-slate-700 mb-1">VEVO API</p>
            <p>Endpoint: /v1/australian-workrights</p>
            <p>Auth: Bearer token + MTLS</p>
            <p>Response: isEntitledToWork, visaClass, visaExpiry, workConditions</p>
          </div>
          <div>
            <p className="font-medium text-slate-700 mb-1">ATO DSP API</p>
            <p>Endpoint: /stapled-super-fund/request</p>
            <p>Auth: X-ATO-Product-ID + Client Certificates</p>
            <p>Response: stapledSuperFundDetails.fundName, USI</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompliancePage;