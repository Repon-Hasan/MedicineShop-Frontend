import React, { useContext, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import AuthContext from '../../AuthContext';
import { Helmet } from 'react-helmet-async';
import axiosSecure from '../utils/axiosSecure';

function AllMedicine() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

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

        window.dispatchEvent(new CustomEvent('cartUpdated'));

        Swal.fire('Added!', `${medicine.name} has been added to your cart.`, 'success');
      } catch (error) {
        console.error('Error saving selected medicine:', error);
        Swal.fire('Error', 'Something went wrong. Try again.', 'error');
      }
    }
  };

  const filteredMedicines = medicines.filter((med) =>
    [med.name, med.generic, med.company]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const sortedMedicines = [...filteredMedicines].sort((a, b) =>
    sortOrder === 'asc' ? a.price - b.price : b.price - a.price
  );

  if (authLoading || userLoading || medsLoading) {
    return (
      <div className="text-center mt-10">
        <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading data...</p>
      </div>
    );
  }

  if (userError || medsError) {
    return <div className="text-red-500 text-center mt-6">Error loading data. Please try again later.</div>;
  }

  if (userData.role !== 'user') {
    return (
      <div className="text-red-500 text-center font-bold py-16">
        Access Denied: Only users can view this page.
      </div>
    );
  }

  return (
    <div className=" mx-auto px-2.5">
      <Helmet>
        <title>All Medicines | MediShop</title>
      </Helmet>

      <h1 className="text-4xl font-bold text-center mb-8 text-green-800">All Medicines</h1>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="🔍 Search by name, generic, company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-5 py-3 rounded-md w-full md:w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        <button
          onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md shadow-sm transition"
        >
          Sort by Price: {sortOrder === 'asc' ? 'Low → High' : 'High → Low'}
        </button>
      </div>

      {/* Medicines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedMedicines.map((med) => (
          <div
            key={med._id}
            className="border rounded-xl shadow-lg pb-3  flex flex-col justify-between bg-white hover:shadow-2xl transition-transform duration-300 transform hover:scale-105"
          >
            <img
              src={med.imageURL}
              alt={med.name}
              className="h-64 w-full object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold  text-gray-800"><span className='font-bold ml-2'>Name:</span> {med.name}</h2>
            <p className="text-gray-600 text-sm"><span className='font-bold ml-2'>Generic: </span>{med.generic}</p>
            <p className=" text-gray-600 text-sm"><span className='font-bold ml-2'>Company: </span> {med.company}</p>
            <p className=" text-green-700 font-semibold my-2 text-lg"><span className='font-bold ml-2'>Price: </span> ${med.price?.toFixed(2)}</p>
             <p className=" text-gray-600 text-sm"><span className='font-bold ml-2'>Description: </span> {med.description}</p>
            <div className="flex ml-3 gap-3 mt-3">
              <button
                onClick={() => handleSelect(med)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded shadow"
              >
                Select
              </button>
              <button
                onClick={() => setSelectedMedicine(med)}
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 text-sm rounded shadow"
              >
                👁️ View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedMedicine && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setSelectedMedicine(null)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-xl shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMedicine(null)}
              className="absolute top-3 right-3 text-2xl text-gray-600 hover:text-red-600"
            >
              &times;
            </button>
            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={selectedMedicine.imageURL}
                alt={selectedMedicine.name}
                className="w-full sm:w-48 object-contain"
              />
              <div className="text-sm space-y-2">
                <h2 className="text-xl font-bold text-gray-800">{selectedMedicine.name}</h2>
                <p><strong>Generic:</strong> {selectedMedicine.generic}</p>
                <p><strong>Company:</strong> {selectedMedicine.company}</p>
                <p><strong>Category:</strong> {selectedMedicine.category}</p>
                <p><strong>Description:</strong> {selectedMedicine.description}</p>
                <p><strong>Price:</strong> ${selectedMedicine.price?.toFixed(2)}</p>
                {selectedMedicine.discount > 0 && (
                  <p className="text-red-600 font-semibold">
                    <strong>Discount:</strong> {selectedMedicine.discount}%
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Summary */}
      <div className="mt-10 bg-gray-100 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">🛒 Cart Summary</h3>
        {cart.length === 0 ? (
          <p className="text-gray-600">No medicines selected yet.</p>
        ) : (
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {cart.map((med) => (
              <li key={med._id}>
                {med.name} - ${med.price.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AllMedicine;
