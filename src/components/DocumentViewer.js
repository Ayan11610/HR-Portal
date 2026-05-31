import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function DocumentViewer({ user, documentType, documentName, documentContent }) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
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
      checkDocumentStatus(data.id);
    }
  };

  const checkDocumentStatus = async (empId) => {
    const { data, error } = await supabase
      .from('policy_acknowledgments')
      .select('*')
      .eq('employee_id', empId)
      .eq('policy_name', documentType);

    if (data && data.length > 0) {
      const doc = data[0];
      setScrolledToBottom(doc.scrolled_to_bottom || false);
      setAcknowledged(doc.acknowledged_at !== null);
    }
  };

  const handleScroll = (e) => {
    const element = e.target;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      if (!scrolledToBottom) {
        setScrolledToBottom(true);
        updateScrollStatus();
      }
    }
  };

  const updateScrollStatus = async () => {
    if (!employeeId) return;

    const { data: existing } = await supabase
      .from('policy_acknowledgments')
      .select('id')
      .eq('employee_id', employeeId)
      .eq('policy_name', documentType);

    if (existing && existing.length > 0) {
      await supabase
        .from('policy_acknowledgments')
        .update({ scrolled_to_bottom: true })
        .eq('id', existing[0].id);
    }
  };

  const handleAcknowledge = async () => {
    if (!employeeId) {
      setMessage('Please complete your profile first.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');

    const { data: existing } = await supabase
      .from('policy_acknowledgments')
      .select('id')
      .eq('employee_id', employeeId)
      .eq('policy_name', documentType);

    let error;

    if (existing && existing.length > 0) {
      const { error: updateError } = await supabase
        .from('policy_acknowledgments')
        .update({
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', existing[0].id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('policy_acknowledgments')
        .insert([{
          employee_id: employeeId,
          policy_name: documentType,
          policy_version: '2024.1',
          scrolled_to_bottom: true,
          acknowledged_at: new Date().toISOString()
        }]);
      error = insertError;
    }

    setLoading(false);

    if (error) {
      setMessage('Error: ' + error.message);
      setMessageType('error');
    } else {
      setAcknowledged(true);
      setMessage('Document acknowledged successfully.');
      setMessageType('success');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">{documentName}</h3>
      
      {acknowledged ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-verified-green text-sm font-medium">Acknowledged on {new Date().toLocaleDateString()}</p>
        </div>
      ) : (
        <>
          <div 
            onScroll={handleScroll}
            className="h-64 overflow-y-auto border border-slate-300 rounded-md p-4 mb-4 bg-slate-50"
          >
            <div className="prose prose-sm max-w-none">
              {documentContent}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {scrolledToBottom 
                ? 'You have read the entire document.' 
                : 'Please scroll to the bottom to read the entire document.'}
            </p>
            
            <button
              onClick={handleAcknowledge}
              disabled={!scrolledToBottom || loading}
              className={`py-2 px-4 rounded-md font-medium text-sm transition duration-200 ${
                scrolledToBottom
                  ? 'bg-portal-navy hover:bg-blue-700 text-white'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Processing...' : 'I Acknowledge'}
            </button>
          </div>
        </>
      )}

      {message && (
        <div className={`mt-4 p-3 rounded-md text-sm ${
          messageType === 'success' 
            ? 'bg-green-50 text-verified-green border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default DocumentViewer;