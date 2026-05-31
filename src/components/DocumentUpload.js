import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function DocumentUpload({ user, documentType, label }) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [fileUrl, setFileUrl] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage('');
    setMessageType('');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}_${documentType}_${Date.now()}.${fileExt}`;
    const filePath = `documents/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('employee-documents')
      .upload(filePath, file);

    if (uploadError) {
      setMessage('Upload failed: ' + uploadError.message);
      setMessageType('error');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('employee-documents')
      .getPublicUrl(filePath);

    setFileUrl(urlData.publicUrl);
    setMessage('Document uploaded successfully.');
    setMessageType('success');
    setUploading(false);
  };

  return (
    <div className="portal-card p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-charcoal text-sm">{label}</h4>
          <p className="text-xs text-slate-500">PDF, JPG, or PNG accepted</p>
        </div>
        {fileUrl && (
          <span className="px-2 py-1 bg-verified-green/10 text-verified-green text-xs font-medium rounded-full">
            Uploaded
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <label className="flex-1">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <div className={`w-full py-2 px-3 border-2 border-dashed rounded-md text-center cursor-pointer transition ${
            uploading 
              ? 'border-slate-300 bg-slate-50' 
              : 'border-portal-navy/30 hover:border-portal-navy bg-sky-wash/50'
          }`}>
            <span className="text-sm text-slate-600">
              {uploading ? 'Uploading...' : fileUrl ? 'Replace file' : 'Click to upload'}
            </span>
          </div>
        </label>
      </div>

      {fileUrl && (
        <p className="mt-2 text-xs text-slate-500 truncate">
          File: <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-anchor-blue underline">View document</a>
        </p>
      )}

      {message && (
        <div className={`mt-3 p-2 rounded-md text-xs ${
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

export default DocumentUpload;