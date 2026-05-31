import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function AuditPage({ user }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    getEmployeeId();
  }, []);

  const getEmployeeId = async () => {
    const { data } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setEmployeeId(data.id);
      fetchAuditLogs(data.id);
    } else {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async (empId) => {
    const { data, error } = await supabase
      .from('system_audit_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });

    if (data) {
      setLogs(data);
    }
    setLoading(false);
  };

  const getActionBadge = (action) => {
    if (action.includes('CREATED')) return 'bg-verified-green/10 text-verified-green border border-verified-green/20';
    if (action.includes('UPDATED')) return 'bg-portal-navy/10 text-portal-navy border border-portal-navy/20';
    if (action.includes('DELETE')) return 'bg-red-50 text-red-600 border border-red-200';
    if (action.includes('ACKNOWLEDGE')) return 'bg-blue-50 text-blue-600 border border-blue-200';
    if (action.includes('COMPLIANCE')) return 'bg-purple-50 text-purple-600 border border-purple-200';
    return 'bg-slate-50 text-slate-600 border border-slate-200';
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('en-AU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-light-border">
        <h2 className="text-xl font-bold text-charcoal">System Audit Trail</h2>
        <p className="text-sm text-slate-500 mt-1">
          Immutable record of all actions performed on your account. 
          Retained for 7 years per Section 535 of the Fair Work Act 2009.
        </p>
      </div>

      {/* Retention Policy Banner */}
      <div className="mb-6 p-4 bg-sky-wash border border-portal-navy/20 rounded-md">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-portal-navy/10 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-portal-navy font-bold text-xs">7Y</span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-charcoal">Mandatory 7-Year Retention</h4>
            <p className="text-xs text-slate-600 mt-1">
              All records are stored in append-only format with immutable timestamps. 
              Soft-deleted records remain accessible for compliance purposes. 
              Data residency: AWS Sydney (ap-southeast-2).
            </p>
          </div>
        </div>
      </div>

      <div className="portal-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-light-border">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-portal-navy border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-slate-500">Loading audit logs...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center">
                    <div className="text-slate-400">
                      <p className="text-sm mb-1">No audit records found</p>
                      <p className="text-xs">Actions will be logged as you use the portal</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-xs text-slate-700 font-medium">{formatTimestamp(log.timestamp)}</p>
                      <p className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleTimeString('en-AU')}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getActionBadge(log.action_type)}`}>
                        {log.action_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-slate-600">{log.record_snapshot?.table || 'System'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-slate-600 max-w-xs truncate">
                        {log.record_snapshot ? JSON.stringify(log.record_snapshot).substring(0, 60) + '...' : '-'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${log.archived ? 'bg-red-50 text-red-600' : 'bg-green-50 text-verified-green'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${log.archived ? 'bg-red-400' : 'bg-green-400'}`}></span>
                        {log.archived ? 'Archived' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Footer */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="portal-card p-4">
          <p className="text-xs text-slate-500 mb-1">Total Records</p>
          <p className="text-lg font-bold text-charcoal">{logs.length}</p>
        </div>
        <div className="portal-card p-4">
          <p className="text-xs text-slate-500 mb-1">Active Records</p>
          <p className="text-lg font-bold text-verified-green">{logs.filter(l => !l.archived).length}</p>
        </div>
        <div className="portal-card p-4">
          <p className="text-xs text-slate-500 mb-1">Archived Records</p>
          <p className="text-lg font-bold text-red-600">{logs.filter(l => l.archived).length}</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-md">
        <p className="text-xs text-slate-500">
          <strong className="text-slate-700">Legal Compliance:</strong> These records satisfy the record-keeping requirements 
          under the Fair Work Act 2009 (Section 535) and the Privacy Act 1988. All timestamps are immutable and stored in 
          UTC+10 (AEST) format. Data is hosted exclusively in Australian cloud regions.
        </p>
      </div>
    </div>
  );
}

export default AuditPage;