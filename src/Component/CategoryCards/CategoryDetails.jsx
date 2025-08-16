import React, { useState, useEffect, useContext } from 'react';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';
import axios from 'axios';
import AuthContext from '../../../AuthContext';

function CategoryDetails() {
  const medicines = useLoaderData();
  const { user } = useContext(AuthContext);

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  // ✅ Fetch user role only when user.email exists
  useEffect(() => {
    const fetchRole = async () => {
      if (user?.email) {
        try {
          const res = await axios.get(`https://backend-nu-livid-37.vercel.app/user/${user.email}`);
          setRole(res.data.role || null);
        } catch (err) {
          console.error('Failed to fetch user role:', err);
          setRole(null);
        } finally {
          setLoadingRole(false);
        }
      } else {
        setLoadingRole(false);
      }
    };
    fetchRole();
  }, [user]);

  const openModal = (medicine) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMedicine(null);
    setIsModalOpen(false);
  };

  const handleSelect = async (medicine) => {
    if (!user?.email) {
      Swal.fire('Please login', 'You must be logged in to select a medicine.', 'warning');
      return;
    }

    if (role !== 'user') {
      Swal.fire('Access Denied', 'Only users can select medicines.', 'error');
      return;
    }

    const alreadyInCart = cart.find((m) => m._id === medicine._id);
    if (alreadyInCart) {
      Swal.fire('Already Selected', `${medicine.name} is already in your cart.`, 'info');
      return;
    }

    try {
      const { data: fullMedicine } = await axios.get(
        `https://backend-nu-livid-37.vercel.app/allMedicines/details/${medicine._id}`
      );

      const medicineToSave = {
        ...fullMedicine,
        sellerEmail: fullMedicine.email,
      };

      await axios.post('https://backend-nu-livid-37.vercel.app/selectedMedicines', {
        email: user.email,
        medicine: medicineToSave,
      });

      setCart((prev) => [...prev, medicineToSave]);
      window.dispatchEvent(new CustomEvent('cartUpdated'));

      Swal.fire('Added!', `${medicine.name} added to cart.`, 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Swal.fire('Error', 'Failed to add medicine to cart.', 'error');
    }
  };

  const getDiscountedPrice = (price, discount) =>
    discount ? (price * (1 - discount / 100)).toFixed(2) : price.toFixed(2);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 px-2">
        <h2 className="text-2xl sm:text-3xl mt-18 md:text-4xl font-extrabold text-green-700 mb-2 leading-snug">
          🏷️ Your Selected Medicines
        </h2>
        <p className="text-gray-500 text-sm sm:text-base">
          Explore all discounted items available in this category
        </p>
      </div>

      {/* Medicines Table */}
      {medicines.length === 0 ? (
        <p className="text-center text-gray-500">No medicines found in this category.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-green-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 border">Name</th>
                <th className="px-4 py-3 border">Generic</th>
                <th className="px-4 py-3 border">Category</th>
                <th className="px-4 py-3 border">Company</th>
                <th className="px-4 py-3 border">Unit</th>
                <th className="px-4 py-3 border">Price</th>
                <th className="px-4 py-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {medicines.map((med) => (
                <tr key={med._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border">{med.name}</td>
                  <td className="px-4 py-2 border">{med.generic}</td>
                  <td className="px-4 py-2 border">{med.category}</td>
                  <td className="px-4 py-2 border">{med.company}</td>
                  <td className="px-4 py-2 border">{med.unit}</td>
                  <td className="px-4 py-2 border">
                    {med.discount ? (
                      <>
                        <span className="text-green-700 font-semibold">
                          ${getDiscountedPrice(med.price, med.discount)}
                        </span>{' '}
                        <span className="line-through text-gray-400">
                          ${med.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span>${med.price.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <div className="flex flex-col sm:flex-row sm:justify-center gap-2">
                      <button
                        onClick={() => openModal(med)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        👁️ View
                      </button>

                      {/* ✅ Show only if role is user */}
                      {!loadingRole && role === 'user' && (
                        <button
                          onClick={() => handleSelect(med)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          ➕ Select
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-xl overflow-y-auto max-h-[90vh] relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold"
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">{selectedMedicine.name}</h3>

            <div className="flex justify-center mb-4">
              <img
                src={selectedMedicine.imageURL}
                alt={selectedMedicine.name}
                className="w-full h-full object-cover rounded border"
              />
            </div>

            <div className="space-y-2 text-gray-700 text-sm">
              <p><strong>Generic:</strong> {selectedMedicine.generic}</p>
              <p><strong>Description:</strong> {selectedMedicine.description}</p>
              <p><strong>Category:</strong> {selectedMedicine.category}</p>
              <p><strong>Company:</strong> {selectedMedicine.company}</p>
              <p><strong>Unit:</strong> {selectedMedicine.unit}</p>
              <p><strong>Price:</strong> ${selectedMedicine.price.toFixed(2)}</p>
              {selectedMedicine.discount && (
                <p><strong>Discount:</strong> {selectedMedicine.discount}%</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Preview */}
      {cart.length > 0 && (
        <div className="mt-10 p-5 bg-gray-50 border rounded shadow max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">🛒 Selected Medicines</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {cart.map((med) => (
              <li key={med._id}>
                {med.name} - ${med.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CategoryDetails;
