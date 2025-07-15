import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../AuthContext';
import UserMain from '../Component/User/UserMain';
import SellerLayout from '../Seller/SellerLayout';
import AdmineLayout from '../Component/Admin/AdmineLayout';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(true);
  const { user, logout, loading } = useContext(AuthContext);
 
  useEffect(() => {
    if (!user || !user.email) return;
  

    setLocalLoading(true);

    fetch(`https://backend-nu-livid-37.vercel.app/user/${user.email}`)
      .then((res) => {
        if (!res.ok) throw new Error('User not found');
        return res.json();
      })
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.message);
      })
      .finally(() => {
        setLocalLoading(false);
      });
  }, [user]);
  console.log('I am user data dashboard',userData)

  if (loading || localLoading) {
    return (
      <div className="flex justify-center items-center h-20">
        <div className="w-8 h-8 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }
console.log("I am user data",userData)
  return (
    <div className="p-6 text-xl font-semibold text-center">
      {userData.role === 'admin' && <AdmineLayout></AdmineLayout>}
      {userData.role === 'user' && <UserMain></UserMain>}
      {userData.role === 'seller' && <SellerLayout></SellerLayout>}
    </div>
  );
}

export default Dashboard;
