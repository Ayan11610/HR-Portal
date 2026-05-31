import React, { useState } from 'react';

function ITStaffDashboard({ user }) {
  const [requests, setRequests] = useState([
    { id: 1, employee: 'John Smith', type: 'Laptop', status: 'Pending', date: '2026-05-28' },
    { id: 2, employee: 'Sarah Wilson', type: 'Monitor', status: 'Completed', date: '2026-05-25' },
    { id: 3, employee: 'Mike Brown', type: 'Keyboard', status: 'Pending', date: '2026-05-30' },
  ]);

  const toggleStatus = (id) => {
    setRequests(requests.map(r => 
      r.id === id ? { ...r, status: r.status === 'Pending' ? 'Completed' : 'Pending' } : r
    ));
  };

  const getStatusBadge = (status) => {
    return status === 'Completed' 
      ? 'bg-verified-green/10 text-verified-green border border-verified-green/20'
      : 'bg-alert-amber/10 text-alert-amber border border-alert-amber/20';
  };

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-light-border">
        <h2 className="text-xl font-bold text-charcoal">IT Staff Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage equipment requests and system access provisioning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="portal-card p-4">
          <p className="text-xs text-slate-500 mb-1">Pending Requests</p>
          <p className="text-2xl font-bold text-alert-amber">{requests.filter(r => r.status === 'Pending').length}</p>
        </div>
        <div className="portal-card p-4">
          <p className="text-xs text-slate-500 mb-1">Completed Today</p>
          <p className="text-2xl font-bold text-verified-green">{requests.filter(r => r.status === 'Completed').length}</p>
        </div>
        <div className="portal-card p-4">
          <p className="text-xs text-slate-500 mb-1">Total Requests</p>
          <p className="text-2xl font-bold text-charcoal">{requests.length}</p>
        </div>
      </div>

      <div className="portal-card overflow-hidden">
        <div className="p-4 border-b border-light-border">
          <h3 className="font-semibold text-charcoal">Equipment Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-light-border">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Employee</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Item</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-charcoal">{req.employee}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{req.type}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{req.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(req.id)}
                      className="text-xs text-anchor-blue hover:text-blue-700 underline"
                    >
                      {req.status === 'Pending' ? 'Mark Complete' : 'Reopen'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ITStaffDashboard;