import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router'; // Ensure you're using react-router-dom
import { set } from 'react-hook-form';
import axiosSecure from '../../utils/axiosSecure';

function CategoryCards() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestMedicines = async () => {
      try {
        const res = await axios.get('https://backend-nu-livid-37.vercel.app/latestMedicines');
        const medicines = res.data;
           setCategories(medicines)
        // Group medicines by category
        const grouped = {};
        medicines.forEach(med => {
          if (!grouped[med.category]) {
            grouped[med.category] = {
              count: 0,
              imageURL: med.imageURL, // use the first image for the category
            };
          }
          grouped[med.category].count += 1;
        });

        // Convert grouped object into array of categories
        const categoryArray = Object.keys(grouped).map(cat => ({
          name: cat,
          imageURL: grouped[cat].imageURL,
          count: grouped[cat].count,
        }));

       // setCategories(categoryArray);
      } catch (err) {
        console.error('Error fetching medicines:', err);
      }
    };

    fetchLatestMedicines();
  }, []);

  const handleClick = (id) => {
    navigate(`/category/${id}`);
    console.log(id)
  };

console.log(categories)
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Medicine Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => handleClick(cat._id)}
            className="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 text-center"
          >
            <div className="h-40 w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded mb-4">
              <img
                src={cat.imageURL}
                alt={cat.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <h3 className="text-lg font-semibold">{cat.name}</h3>
            <p className="text-sm text-gray-600">{cat.count} medicine{cat.count > 1 ? 's' : ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryCards;
