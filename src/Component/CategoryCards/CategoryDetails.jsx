import React, { useState, useContext } from 'react';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';
import axios from 'axios';
import AuthContext from '../../../AuthContext';

function CategoryDetails() {
  const medicines = useLoaderData(); // medicines array for the category
  const { user } = useContext(AuthContext);

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cart, setCart] = useState([]);

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
      Swal.fire('Added!', `${medicine.name} added to cart.`, 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Swal.fire('Error', 'Failed to add medicine to cart.', 'error');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Medicines in this Category</h2>

      {medicines.length === 0 ? (
        <p className="text-center text-gray-500">No medicines found in this category.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full text-sm border">
            <thead className="bg-green-100 text-left">
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Generic</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Company</th>
                <th className="border px-4 py-2">Unit</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med) => (
                <tr key={med._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{med.name}</td>
                  <td className="border px-4 py-2">{med.generic}</td>
                  <td className="border px-4 py-2">{med.category}</td>
                  <td className="border px-4 py-2">{med.company}</td>
                  <td className="border px-4 py-2">{med.unit}</td>
                  <td className="border px-4 py-2">${med.price.toFixed(2)}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => openModal(med)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => handleSelect(med)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      ➕ Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
            >
              ×
            </button>

            <h3 className="text-xl font-bold mb-4 text-center">{selectedMedicine.name}</h3>
            <img
              src={selectedMedicine.imageURL}
              alt={selectedMedicine.name}
              className="w-full h-60 object-contain mb-4 rounded"
            />
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Generic:</strong> {selectedMedicine.generic}</p>
              <p><strong>Description:</strong> {selectedMedicine.description}</p>
              <p><strong>Category:</strong> {selectedMedicine.category}</p>
              <p><strong>Company:</strong> {selectedMedicine.company}</p>
              <p><strong>Unit:</strong> {selectedMedicine.unit}</p>
              <p><strong>Price:</strong> ${selectedMedicine.price.toFixed(2)}</p>
              <p><strong>Discount:</strong> {selectedMedicine.discount}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Cart Preview */}
      {cart.length > 0 && (
        <div className="mt-8 p-4 bg-gray-100 rounded shadow max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-2">Selected Medicines</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
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
