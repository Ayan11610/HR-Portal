import React from 'react';
import ProfileForm from '../components/ProfileForm';
import { motion } from 'framer-motion';

function ProfilePage({ user }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Personal Profile</h2>
        <p className="text-slate-600">
          Complete your employment and financial details. All sensitive data is encrypted using AES-256.
        </p>
      </div>
      <ProfileForm user={user} />
    </motion.div>
  );
}

export default ProfilePage;
