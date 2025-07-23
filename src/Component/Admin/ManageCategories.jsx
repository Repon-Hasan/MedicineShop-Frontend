import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import axiosSecure from '../../utils/axiosSecure';

const CLOUDINARY_UPLOAD_PRESET = 'public_signup';
const CLOUDINARY_CLOUD_NAME = 'dum3hqgvv';

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: '',
    imageFile: null,
    generic: '',
    description: '',
    company: '',
    unit: '',
    price: '',
    discount: ''
  });
  const [updateData, setUpdateData] = useState({ id: '', categoryName: '' });

  useEffect(() => {
    axiosSecure.get('https://backend-nu-livid-37.vercel.app/allMedicines')
      .then(res => setCategories(res.data))
      .catch(() => Swal.fire('Error', 'Failed to load categories', 'error'));
  }, []);

  const handleInputChange = e => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      setFormData(prev => ({ ...prev, imageFile: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddCategory = async () => {
    try {
      const {
        categoryName, imageFile, generic, description,
        company, unit, price, discount
      } = formData;

      if (!imageFile || !categoryName.trim()) {
        return Swal.fire('Error', 'Please provide a category name and image', 'error');
      }

      // Upload image to Cloudinary
      const imageForm = new FormData();
      imageForm.append('file', imageFile);
      imageForm.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const imgRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        imageForm
      );

      const imageURL = imgRes.data.secure_url;

      // Construct full payload
      const categoryPayload = {
        name: `__category__${categoryName}`,
        generic,
        description,
        category: categoryName,
        company,
        unit,
        price: parseFloat(price),
        discount: parseFloat(discount),
        imageURL,
        email: 'admin@admin.com'
      };

      console.log('Payload:', categoryPayload);

      await axios.post('https://backend-nu-livid-37.vercel.app/medicines', categoryPayload);

      setCategories(prev => [...prev, {
        _id: Date.now().toString(),
        category: categoryName,
        imageURL
      }]);

      setFormData({
        categoryName: '',
        imageFile: null,
        generic: '',
        description: '',
        company: '',
        unit: '',
        price: '',
        discount: ''
      });

      setIsAddModalOpen(false);
      Swal.fire('Success', 'Category added successfully!', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err?.response?.data?.error || 'Failed to add category', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://backend-nu-livid-37.vercel.app/allMedicines/categories/${id}`);
        setCategories(prev => prev.filter(cat => cat._id !== id));
        Swal.fire('Deleted!', 'Category has been deleted.', 'success');
      } catch {
        Swal.fire('Error', 'Failed to delete category', 'error');
      }
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://backend-nu-livid-37.vercel.app/allMedicines/categories/${updateData.id}`, {
        categoryName: updateData.categoryName,
      });

      setCategories(prev =>
        prev.map(cat =>
          cat._id === updateData.id
            ? { ...cat, category: updateData.categoryName }
            : cat
        )
      );

      setIsUpdateModalOpen(false);
      Swal.fire('Updated!', 'Category updated successfully!', 'success');
    } catch {
      Swal.fire('Error', 'Failed to update category', 'error');
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Categories</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Category
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white border shadow rounded-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Category Name</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{cat.category}</td>
                <td className="p-3">
                  <img
                    src={cat.imageURL || 'https://via.placeholder.com/150'}
                    alt={cat.category}
                    className="h-16 w-16 object-cover rounded shadow"
                  />
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setUpdateData({ id: cat._id, categoryName: cat.category });
                        setIsUpdateModalOpen(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No categories available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 overflow-auto">
          <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Category</h3>
            {[
              { name: 'categoryName', placeholder: 'Category Name' },
              { name: 'generic', placeholder: 'Generic' },
              { name: 'description', placeholder: 'Description' },
              { name: 'company', placeholder: 'Company' },
              { name: 'unit', placeholder: 'Unit' },
              { name: 'price', placeholder: 'Price', type: 'number' },
              { name: 'discount', placeholder: 'Discount', type: 'number' },
            ].map(({ name, placeholder, type = 'text' }) => (
              <input
                key={name}
                type={type}
                name={name}
                placeholder={placeholder}
                className="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData[name]}
                onChange={handleInputChange}
              />
            ))}
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleInputChange}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-700 px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Update Category</h3>
            <input
              type="text"
              value={updateData.categoryName}
              onChange={(e) =>
                setUpdateData(prev => ({ ...prev, categoryName: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="New Category Name"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-gray-700 px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageCategories;
