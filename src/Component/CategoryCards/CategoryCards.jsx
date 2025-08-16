import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axiosSecure from '../../utils/axiosSecure';

function CategoryCards() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriesFromMedicines = async () => {
      try {
        const res = await axiosSecure.get(
          'https://backend-nu-livid-37.vercel.app/allMedicines'
        );
        const medicines = res.data;

        const categoryMap = {};
        medicines.forEach((med) => {
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

        const categoryList = Object.entries(categoryMap)
          .map(([name, data]) => ({
            _id: name,
            categoryName: data.categoryName,
            categoryImage: data.imageURL,
            count: data.count,
          }))
          .reverse();

        setCategories(categoryList);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategoriesFromMedicines();
  }, []);

  const handleClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };

  return (
    <div className="p-6 max-w-screen-2xl mx-auto" id='categories'>
      <h2 className="text-3xl font-extrabold mb-8 text-center md:mt-8 ">Latest Categories</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
        {categories.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No categories available.</p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat._id}
              className="w-full bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105 flex flex-col"
            >
              {/* Image */}
              <div className="h-64 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-lg">
                <img
                  src={cat.categoryImage}
                  alt={cat.categoryName}
                  className="h-full w-full object-cover p-0.5 rounded-t-lg "
                />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-2xl font-semibold text-gray-800">{cat.categoryName}</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {cat.count} medicine{cat.count !== 1 ? 's' : ''}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Browse all medicines under this category.
                </p>

                {/* Button */}
                <button
                  onClick={() => handleClick(cat.categoryName)}
                  className="mt-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full"
                >
                  See More
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CategoryCards;
