import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import axiosSecure from '../../utils/axiosSecure';

function CategoryCards() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriesFromMedicines = async () => {
      try {
        const res = await axiosSecure.get('https://backend-nu-livid-37.vercel.app/allMedicines');
        const medicines = res.data;
console.log(medicines)
        const categoryMap = {};

        medicines.forEach(med => {
          const cat = med.category;
          const image = med.categoryImage || med.imageURL || 'https://via.placeholder.com/150';
          if (cat) {
            if (!categoryMap[cat]) {
              categoryMap[cat] = {
                categoryName: cat,
                imageURL: image,
                count: 1,
              };
            } else {
              categoryMap[cat].count += 1;
            }
          }
        });

        // Convert to array and get latest 6 categories
        const categoryList = Object.entries(categoryMap)
          .map(([name, data]) => ({
            _id: name, // using category name as key
            categoryName: data.categoryName,
            categoryImage: data.imageURL,
            count: data.count,
          }))
          .reverse() // latest ones last (or sort if needed)
          // .slice(0, 6);

        setCategories(categoryList);
      } catch (err) {
        console.error('Error fetching categories from medicines:', err);
      }
    };

    fetchCategoriesFromMedicines();
  }, []);

  const handleClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Latest Categories</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No categories available.</p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => handleClick(cat.categoryName)}
              className="cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center"
            >
              <div className="h-52 w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded mb-6">
                <img
                  src={cat.categoryImage}
                  alt={cat.categoryName}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold">{cat.categoryName}</h3>
              <p className="text-md text-gray-600 mt-1">
                {cat.count} medicine{cat.count !== 1 ? 's' : ''}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CategoryCards;
