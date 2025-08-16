import React, { useContext, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import AuthContext from '../../AuthContext';
import { Helmet } from 'react-helmet-async';
import axiosSecure from '../utils/axiosSecure';

function AllMedicinesPage() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ['user', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`https://backend-nu-livid-37.vercel.app/user/${user.email}`);
      return res.data;
    },
  });

  const {
    data: medicines = [],
    isLoading: medsLoading,
    error: medsError,
  } = useQuery({
    queryKey: ['medicines'],
    enabled: !!userData && userData.role === 'user',
    queryFn: async () => {
      const res = await axiosSecure.get('https://backend-nu-livid-37.vercel.app/allMedicines');
      return res.data;
    },
  });

  const handleSelect = async (medicine) => {
    if (!user?.email) {
      Swal.fire('Please login', 'You must be logged in to select a medicine.', 'warning');
      return;
    }

    const alreadyInCart = cart.find((m) => m._id === medicine._id);
    if (alreadyInCart) {
      Swal.fire('Already Selected', `${medicine.name} is already in your cart.`, 'info');
      return;
    }

    const result = await Swal.fire({
      title: 'Add to Cart?',
      html: `
        <strong>${medicine.name}</strong><br/>
        Generic: ${medicine.generic}<br/>
        Price: $${medicine.price.toFixed(2)}<br/>
        Discount: ${medicine.discount}%`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Add it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
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

        // Dispatch event so Navbar or any listener can update cart count
        window.dispatchEvent(new CustomEvent('cartUpdated'));

        Swal.fire('Added!', `${medicine.name} has been added to your cart.`, 'success');
      } catch (error) {
        console.error('Error saving selected medicine:', error);
        Swal.fire('Error', 'Something went wrong. Try again.', 'error');
      }
    }
  };

  const closeModal = () => setSelectedMedicine(null);

  const filteredMedicines = medicines.filter((med) =>
    [med.name, med.generic, med.company]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const sortedMedicines = [...filteredMedicines].sort((a, b) => {
    return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
  });

  const totalPages = Math.ceil(sortedMedicines.length / itemsPerPage);
  const paginatedMedicines = sortedMedicines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (authLoading || userLoading) {
    return (
      <div className="text-center mt-10">
        <div className="w-8 h-8 border-4 border-green-500 border-dashed rounded-full animate-spin mx-auto"></div>
        <p>Loading user info...</p>
      </div>
    );
  }

  if (userError) {
    return <div className="text-red-500 text-center mt-4">Failed to load user data</div>;
  }

  if (userData.role !== 'user') {
    return (
      <div className="text-red-500 text-center mt-10 font-bold text-lg py-16  ">
        Access Denied: Only users with a "user" role can access this page.
      </div>
    );
  }

  if (medsLoading) {
    return (
      <div className="text-center mt-10">
        <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>
        <p>Loading medicines...</p>
      </div>
    );
  }

  if (medsError) {
    return <div className="text-red-500 text-center mt-4">Failed to fetch medicines</div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto" id='/available'>
      <Helmet>
        <title>Shop Medicines | MediShop</title>
        <meta name="description" content="Browse and search medicines by name, generic, company. Add items to your cart easily." />
      </Helmet>

      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">All Medicines</h1>

      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <input
          type="text"
          placeholder="Search by name, generic, company..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded w-full md:w-1/2 text-sm"
        />
        <button
          onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded text-sm"
        >
          Sort by Price: {sortOrder === 'asc' ? 'Low → High' : 'High → Low'}
        </button>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm border border-collapse">
          <thead className="bg-green-100 text-xs sm:text-sm">
            <tr>
              <th className="border px-2 py-2">Name</th>
              <th className="border px-2 py-2">Generic</th>
              <th className="border px-2 py-2">Category</th>
              <th className="border px-2 py-2">Company</th>
              <th className="border px-2 py-2">Price</th>
              <th className="border px-2 py-2">Discount</th>
              <th className="border px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMedicines.map((med) => (
              <tr key={med._id} className="hover:bg-gray-50">
                <td className="border px-2 py-2">{med.name}</td>
                <td className="border px-2 py-2">{med.generic}</td>
                <td className="border px-2 py-2">{med.category}</td>
                <td className="border px-2 py-2">{med.company}</td>
                <td className="border px-2 py-2">${med.price?.toFixed(2)}</td>
                <td className="border px-2 py-2">{med.discount}%</td>
                <td className="border px-2 py-2 space-x-1">
                  <button
                    onClick={() => handleSelect(med)}
                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                  >
                    Select
                  </button>
                  <button
                    onClick={() => setSelectedMedicine(med)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                  >
                    👁️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-1 flex-wrap">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50 text-sm"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded text-sm ${
              currentPage === i + 1 ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50 text-sm"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedMedicine && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg max-w-lg w-11/12 p-4 sm:p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">{selectedMedicine.name}</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <img
                src={selectedMedicine.imageURL}
                alt={selectedMedicine.name}
                className="w-full sm:w-48 object-contain rounded"
              />
              <div className="text-sm">
                <p>
                  <strong>Generic:</strong> {selectedMedicine.generic}
                </p>
                <p>
                  <strong>Description:</strong> {selectedMedicine.description}
                </p>
                <p>
                  <strong>Category:</strong> {selectedMedicine.category}
                </p>
                <p>
                  <strong>Company:</strong> {selectedMedicine.company}
                </p>
                <p>
                  <strong>Unit:</strong> {selectedMedicine.unit}
                </p>
                <p>
                  <strong>Price:</strong> ${selectedMedicine.price.toFixed(2)}{' '}
                  {selectedMedicine.discount > 0 && (
                    <span className="text-red-600 ml-2">({selectedMedicine.discount}% off)</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Summary */}
      <div className="mt-8 p-4 bg-gray-100 rounded shadow max-w-2xl mx-auto text-sm">
        <h3 className="text-lg font-semibold mb-2">Selected Medicines in Cart:</h3>
        {cart.length === 0 ? (
          <p>No medicines selected yet.</p>
        ) : (
          <ul className="list-disc list-inside space-y-1">
            {cart.map((med) => (
              <li key={med._id}>
                {med.name} ({med.generic}) - ${med.price.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AllMedicinesPage;
