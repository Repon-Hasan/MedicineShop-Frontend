import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../AuthContext';
import axios from 'axios';

// Cloudinary configuration
const CLOUDINARY_UPLOAD_PRESET = 'public_signup'; // use same as ManageMedicines
const CLOUDINARY_CLOUD_NAME = 'dum3hqgvv';

const Advertisement = () => {
  const { user } = useContext(AuthContext);
  const [ads, setAds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ imageURL: '', description: '' });
  const [uploading, setUploading] = useState(false);

  // Fetch ads from backend
  const fetchAds = async () => {
    try {
      const res = await axios.get(`https://backend-nu-livid-37.vercel.app/advertisements/${user.email}`);
      setAds(res.data || []);
    } catch (err) {
      console.error('Failed to load ads:', err);
    }
  };

  useEffect(() => {
    if (user?.email) fetchAds();
  }, [user?.email]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return alert("No image selected!");

    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        data
      );
      const imageURL = res.data.secure_url;
      setFormData(prev => ({ ...prev, imageURL }));
    } catch (err) {
      console.error('Image upload failed:', err.response?.data || err.message);
      alert('Image upload failed. Check console for details.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageURL) return alert('Please upload an image.');

    try {
      await axios.post('https://backend-nu-livid-37.vercel.app/advertisements', {
        ...formData,
        email: user.email,
        status: 'Pending',
      });
      alert('Advertisement submitted!');
      setModalOpen(false);
      setFormData({ imageURL: '', description: '' });
      fetchAds();
    } catch (err) {
      console.error('Failed to submit advertisement:', err);
      alert('Submission failed. Check console.');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Your Advertisements</h2>

      <button
        onClick={() => setModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-6"
      >
        + Add Advertisement
      </button>

      {ads.length === 0 ? (
        <p className="text-gray-500">No advertisements submitted yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {ads.map((ad, idx) => (
            <div key={idx} className="border rounded p-4 shadow-sm bg-white">
              <img src={ad.imageURL} alt="Ad" className="w-full h-40 object-cover rounded mb-2" />
              <p className="text-sm mb-2">{ad.description}</p>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  ad.status === 'Approved'
                    ? 'bg-green-100 text-green-600'
                    : ad.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {ad.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Submit Advertisement</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mb-4 w-full"
              />
              {uploading && <p className="text-sm text-blue-600 mb-2">Uploading image...</p>}
              {formData.imageURL && (
                <img
                  src={formData.imageURL}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded mb-4"
                />
              )}
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full border p-2 rounded mb-4"
                required
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  disabled={uploading}
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Advertisement;
