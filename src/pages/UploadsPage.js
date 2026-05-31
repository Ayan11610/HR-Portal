import React from 'react';
import DocumentUpload from '../components/DocumentUpload';

function UploadsPage({ user }) {
  return (
    <div>
      <div className="mb-6 pb-4 border-b border-light-border">
        <h2 className="text-xl font-bold text-charcoal">Document Upload</h2>
        <p className="text-sm text-slate-500 mt-1">
          Upload your identity and right-to-work documents. Files are stored securely in Australian data centers.
        </p>
      </div>

      <DocumentUpload 
        user={user}
        documentType="passport"
        label="Passport or Birth Certificate"
      />

      <DocumentUpload 
        user={user}
        documentType="visa"
        label="Visa Grant Notice (if applicable)"
      />

      <DocumentUpload 
        user={user}
        documentType="id_card"
        label="Photo ID (Driver License or Proof of Age)"
      />

      <DocumentUpload 
        user={user}
        documentType="medicare"
        label="Medicare Card or Health Insurance"
      />
    </div>
  );
}

export default UploadsPage;