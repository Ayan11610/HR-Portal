import React from 'react';
import ProfileForm from '../components/ProfileForm';

function ProfilePage({ user }) {
  return (
    <div>
      <div className="mb-6 pb-4 border-b border-light-border">
        <h2 className="text-xl font-bold text-charcoal">Personal Profile</h2>
        <p className="text-sm text-slate-500 mt-1">
          Complete your employment and financial details. 
          Tax File Numbers and bank details are encrypted using AES-256 via pgcrypto. 
          All data stored in Australian data centers (AWS Sydney).
        </p>
      </div>
      <ProfileForm user={user} />
    </div>
  );
}

export default ProfilePage;