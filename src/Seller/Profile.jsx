import React, { useContext } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import AuthContext from '../../AuthContext';
function Profile() {
    const { user } = useContext(AuthContext);
  return (
   <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
  className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto space-y-6"
>
  {/* Profile Header */}
  <div className="  space-x-6">
    <img
      src={user?.photoURL || '/default-profile.png'}
      alt="Profile"
      className="w-24 h-24 rounded-full object-cover border-4 border-green-100 shadow-md mx-auto"
    />
    <div>
      <h3 className="text-2xl font-semibold text-gray-800">{user?.displayName || 'Your Name'}</h3>
      <p className="text-gray-500 text-sm">{user?.email}</p>
        <span className="mt-2 px-4 py-1 rounded-full text-sm bg-green-100 text-green-700">
          Role: "seller"
        </span>
    </div>
  </div>

  {/* Profile Details */}
  <div className="space-y-3 text-gray-700">
    <div className="flex items-center justify-between">
      <span className="font-medium">Phone</span>
      <span>{user?.phoneNumber || '01317954146'}</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="font-medium">Address</span>
      <span className="text-right">{user?.address || 'Dhaka'}</span>
    </div>
  </div>
</motion.div>
  )
}

export default Profile
