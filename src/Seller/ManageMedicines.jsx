import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import AuthContext from '../../AuthContext';
import axiosSecure from '../utils/axiosSecure';

function ManageMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { user } = useContext(AuthContext);

  const fetchList = async () => {
    try {
      const { data } = await axiosSecure.get(
        `https://backend-nu-livid-37.vercel.app/allMedicines/${user.email}`
      );
      setMedicines(data);
    } catch (err) {
      console.error('Failed to fetch medicines:', err);
    }
  };

  useEffect(() => {
    if (user?.email) fetchList();
  }, [user]);

  const onSubmit = async (formData) => {
    try {
      const imageFile = formData.image[0];
      const imgForm = new FormData();
      imgForm.append('file', imageFile);
      imgForm.append('upload_preset', 'public_signup');

      const imgRes = await axios.post(
        'https://api.cloudinary.com/v1_1/dum3hqgvv/image/upload',
        imgForm
      );
      const imageURL = imgRes.data.secure_url;

      const payload = {
        email: user.email,
        name: formData.name,
        generic: formData.generic,
        description: formData.description,
        category: formData.category,
        company: formData.company,
        unit: formData.unit,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount) || 0,
        imageURL,
      };

      await axios.post('https://backend-nu-livid-37.vercel.app/medicines', payload);
      await axios.post('https://backend-nu-livid-37.vercel.app/categories', {
        categoryName: formData.category,
        categoryImage: imageURL,
      });

      reset();
      setShowModal(false);
      fetchList();
    } catch (error) {
      console.error('Error submitting medicine:', error);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={() => setShowModal(true)}
      >
        Add Medicine
      </button>

      <div className="overflow-x-auto rounded shadow">
        <table className="w-full table-auto border border-gray-300 text-sm md:text-base">
          <thead className="bg-green-100 text-gray-700">
            <tr>
              {['Name', 'Generic', 'Category', 'Company', 'Unit', 'Price', 'Discount', 'Image'].map((h) => (
                <th key={h} className="px-4 py-2 border text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {medicines.map((m) => (
              <tr key={m._id} className="hover:bg-gray-50 border-b text-gray-800">
                <td className="px-4 py-2">{m.name}</td>
                <td className="px-4 py-2">{m.generic}</td>
                <td className="px-4 py-2">{m.category}</td>
                <td className="px-4 py-2">{m.company}</td>
                <td className="px-4 py-2">{m.unit}</td>
                <td className="px-4 py-2">${m.price.toFixed(2)}</td>
                <td className="px-4 py-2">{m.discount}%</td>
                <td className="px-4 py-2">
                  <img
                    src={m.imageURL}
                    alt="medicine"
                    className="h-10 w-10 object-cover mx-auto rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-start p-4 pt-20 overflow-y-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4 md:p-6 space-y-4"
          >
            <h3 className="text-xl font-semibold text-center md:text-left">Add New Medicine</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[{ name: 'name', label: 'Medicine Name' }, { name: 'generic', label: 'Generic Name' }, { name: 'description', label: 'Description' }, { name: 'category', label: 'Category' }, { name: 'company', label: 'Company' }].map((f) => (
                <div key={f.name}>
                  <label className="block mb-1 font-medium">{f.label}</label>
                  <input
                    type="text"
                    {...register(f.name, { required: `${f.label} is required` })}
                    className={`w-full border px-3 py-2 rounded focus:ring-2 ${errors[f.name] ? 'border-red-500' : 'focus:ring-green-400'}`}
                  />
                  {errors[f.name] && <p className="text-red-500 text-sm mt-1">{errors[f.name].message}</p>}
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register('image', { required: 'Image is required' })}
                  className={`w-full border px-3 py-2 rounded ${errors.image ? 'border-red-500' : ''}`}
                />
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-medium">Unit</label>
                <select
                  {...register('unit', { required: 'Unit is required' })}
                  className={`w-full border px-3 py-2 rounded ${errors.unit ? 'border-red-500' : ''}`}
                >
                  <option value="">Select unit</option>
                  <option value="Mg">Mg</option>
                  <option value="ML">ML</option>
                </select>
                {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Price</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { required: 'Price is required' })}
                  className={`w-full border px-3 py-2 rounded ${errors.price ? 'border-red-500' : ''}`}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Discount (%)</label>
                <input
                  type="number"
                  step="0.01"
                  defaultValue="0"
                  {...register('discount')}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Save Medicine
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ManageMedicines;
