import React from 'react';
import DocumentViewer from '../components/DocumentViewer';
import { fairWorkPolicy, privacyPolicy, whsPolicy } from '../components/PolicyDocuments';

function DocumentsPage({ user }) {
  return (
    <div>
      <div className="mb-6 pb-4 border-b border-light-border">
        <h2 className="text-xl font-bold text-charcoal">Required Documents</h2>
        <p className="text-sm text-slate-500 mt-1">
          You must read and acknowledge all documents before proceeding. 
          Scroll to the bottom of each document to enable acknowledgement. 
          This provides an auditable timestamp for Fair Work Act compliance.
        </p>
      </div>

      <DocumentViewer 
        user={user}
        documentType="Fair Work Information Statement"
        documentName="Fair Work Act 2009 - Employee Rights and Obligations"
        documentContent={<div className="whitespace-pre-wrap text-sm text-slate-700">{fairWorkPolicy}</div>}
      />

      <DocumentViewer 
        user={user}
        documentType="Privacy Policy"
        documentName="Australian Privacy Principles - Employee Data Handling"
        documentContent={<div className="whitespace-pre-wrap text-sm text-slate-700">{privacyPolicy}</div>}
      />

      <DocumentViewer 
        user={user}
        documentType="Workplace Health and Safety"
        documentName="WHS Policy and Emergency Procedures"
        documentContent={<div className="whitespace-pre-wrap text-sm text-slate-700">{whsPolicy}</div>}
      />
    </div>
  );
}

export default DocumentsPage;