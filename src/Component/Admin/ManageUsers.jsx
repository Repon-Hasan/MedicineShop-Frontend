import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('https://backend-nu-livid-37.vercel.app/admin/users')
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load users');
        setLoading(false);
      });
  }, []);

  const updateRole = (userId, newRole) => {
    axios
      .patch(`https://backend-nu-livid-37.vercel.app/admin/user-role/${userId}`, {
        role: newRole,
      })
      .then(() => {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      })
      .catch(() => alert('Failed to update role'));
  };

  if (loading)
    return (
      <p className="text-center py-10 text-lg text-gray-600">Loading users...</p>
    );
  if (error)
    return (
      <p className="text-center text-red-600 py-10">{error}</p>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Manage Users</h2>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full text-sm text-gray-700 bg-white hidden md:table">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Name</th>
              <th className="px-6 py-3 text-left font-medium">Email</th>
              <th className="px-6 py-3 text-left font-medium">Role</th>
              <th className="px-6 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4">{user.username || '—'}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 capitalize">{user.role}</td>
                <td className="px-6 py-4 space-x-2 flex flex-wrap gap-2">
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => updateRole(user._id, 'admin')}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Make Admin
                    </button>
                  )}
                  {user.role !== 'seller' && (
                    <button
                      onClick={() => updateRole(user._id, 'seller')}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                      Make Seller
                    </button>
                  )}
                  {user.role !== 'user' && (
                    <button
                      onClick={() => updateRole(user._id, 'user')}
                      className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                    >
                      Demote to User
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Responsive card layout for small screens */}
        <div className="md:hidden divide-y">
          {users.map((user) => (
            <div key={user._id} className="p-4 space-y-2">
              <div>
                <span className="font-medium">Name:</span>{' '}
                {user.username || '—'}
              </div>
              <div>
                <span className="font-medium">Email:</span> {user.email}
              </div>
              <div>
                <span className="font-medium">Role:</span>{' '}
                <span className="capitalize">{user.role}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {user.role !== 'admin' && (
                  <button
                    onClick={() => updateRole(user._id, 'admin')}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Make Admin
                  </button>
                )}
                {user.role !== 'seller' && (
                  <button
                    onClick={() => updateRole(user._id, 'seller')}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Make Seller
                  </button>
                )}
                {user.role !== 'user' && (
                  <button
                    onClick={() => updateRole(user._id, 'user')}
                    className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                  >
                    Demote to User
                  </button>
                )}
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No users found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
