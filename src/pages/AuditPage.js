import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

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
    if (action.includes('CREATED')) return 'bg-verified-green/10 text-verified-green border-verified-green/20';
    if (action.includes('UPDATED')) return 'bg-anchor-blue/10 text-anchor-blue border-anchor-blue/20';
    if (action.includes('DELETE')) return 'bg-red-50 text-red-600 border-red-200';
    if (action.includes('ACKNOWLEDGE')) return 'bg-blue-50 text-blue-600 border-blue-200';
    if (action.includes('COMPLIANCE')) return 'bg-purple-50 text-purple-600 border-purple-200';
    return 'bg-slate-50 text-slate-600 border-slate-200';
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">System Audit Trail</h2>
        <p className="text-slate-600">
          Immutable record of all actions performed on your account
        </p>
      </div>

      {/* Retention Policy Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 p-6 bg-gradient-to-r from-anchor-blue/5 to-verified-green/5 border border-anchor-blue/20 rounded-xl"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-anchor-blue rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">7Y</span>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Mandatory 7-Year Retention</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              All records are stored in append-only format with immutable timestamps. 
              Soft-deleted records remain accessible for compliance purposes. 
              Data residency: AWS Sydney (ap-southeast-2).
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="portal-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Action</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="shimmer-effect w-full h-20 rounded-lg"></div>
                      <span className="text-sm text-slate-500">Loading audit logs...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-slate-400">
                      <p className="text-sm mb-1 font-medium">No audit records found</p>
                      <p className="text-xs">Actions will be logged as you use the portal</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <motion.tr 
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-900 font-medium">{formatTimestamp(log.timestamp)}</p>
                      <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleTimeString('en-AU')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getActionBadge(log.action_type)}`}>
                        {log.action_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 font-medium">{log.record_snapshot?.table || 'System'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 max-w-xs truncate">
                        {log.record_snapshot ? JSON.stringify(log.record_snapshot).substring(0, 60) + '...' : '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full ${log.archived ? 'bg-red-50 text-red-600' : 'bg-verified-green/10 text-verified-green'}`}>
                        <span className={`w-2 h-2 rounded-full ${log.archived ? 'bg-red-400' : 'bg-verified-green'}`}></span>
                        {log.archived ? 'Archived' : 'Active'}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Compliance Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="portal-card p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Records</p>
          <p className="text-3xl font-bold text-slate-900">{logs.length}</p>
        </div>
        <div className="portal-card p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Active Records</p>
          <p className="text-3xl font-bold text-verified-green">{logs.filter(l => !l.archived).length}</p>
        </div>
        <div className="portal-card p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Archived Records</p>
          <p className="text-3xl font-bold text-red-600">{logs.filter(l => l.archived).length}</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-6 bg-slate-50 border border-slate-200 rounded-xl"
      >
        <p className="text-sm text-slate-600 leading-relaxed">
          <strong className="text-slate-900">Legal Compliance:</strong> These records satisfy the record-keeping requirements 
          under the Fair Work Act 2009 (Section 535) and the Privacy Act 1988. All timestamps are immutable and stored in 
          UTC+10 (AEST) format. Data is hosted exclusively in Australian cloud regions.
        </p>
      </motion.div>
    </motion.div>
  );
}

export default AuditPage;
