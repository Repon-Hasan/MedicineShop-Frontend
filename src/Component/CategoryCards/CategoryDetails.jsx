import React from 'react';
import { useLoaderData } from 'react-router'; // ✅ use react-router-dom

function CategoryDetails() {
  const medicine = useLoaderData(); // a single object, not an array
  console.log(medicine);

  if (!medicine || !medicine.name) {
    return (
      <div className="p-6 text-center text-gray-600">
        No medicine data found.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Medicine Detail: {medicine.name}
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-collapse">
          <thead className="bg-green-100">
            <tr>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Generic</th>
              <th className="border px-4 py-2 text-left">Description</th>
              <th className="border px-4 py-2 text-left">Category</th>
              <th className="border px-4 py-2 text-left">Company</th>
              <th className="border px-4 py-2 text-left">Unit</th>
              <th className="border px-4 py-2 text-left">Price</th>
              <th className="border px-4 py-2 text-left">Discount</th>
              <th className="border px-4 py-2 text-left">Image</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="border px-4 py-2">{medicine.name}</td>
              <td className="border px-4 py-2">{medicine.generic}</td>
              <td className="border px-4 py-2">{medicine.description}</td>
              <td className="border px-4 py-2">{medicine.category}</td>
              <td className="border px-4 py-2">{medicine.company}</td>
              <td className="border px-4 py-2">{medicine.unit}</td>
              <td className="border px-4 py-2">${medicine.price.toFixed(2)}</td>
              <td className="border px-4 py-2">{medicine.discount}%</td>
              <td className="border px-4 py-2">
                <img
                  src={medicine.imageURL}
                  alt={medicine.name}
                  className="h-16 w-16 object-contain mx-auto"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CategoryDetails;
