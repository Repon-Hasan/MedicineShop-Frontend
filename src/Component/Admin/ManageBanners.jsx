import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import axiosSecure from "../../utils/axiosSecure";

function ManageBanners() {
  const [ads, setAds] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState(new Set());

  // Fetch ads and banners
  const fetchData = async () => {
    setLoading(true);
    try {
      const [adsRes, bannersRes] = await Promise.all([
        axiosSecure.get("https://backend-nu-livid-37.vercel.app/advertisements"),
        axiosSecure.get("https://backend-nu-livid-37.vercel.app/banners"),
      ]);
      setAds(adsRes.data);
      setBanners(bannersRes.data);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isInSlider = (ad) => banners.some((b) => b._id === ad._id);

  const setProcessing = (id, value) => {
    setProcessingIds((prev) => {
      const newSet = new Set(prev);
      value ? newSet.add(id) : newSet.delete(id);
      return newSet;
    });
  };

  const addToSlider = async (ad) => {
    if (processingIds.has(ad._id)) return;
    setProcessing(ad._id, true);
    try {
      await axios.post("https://backend-nu-livid-37.vercel.app/banners", ad);
      Swal.fire("Success", "Added to slider", "success");
      fetchData();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to add", "error");
    } finally {
      setProcessing(ad._id, false);
    }
  };

  const removeFromSlider = async (ad) => {
    if (processingIds.has(ad._id)) return;
    setProcessing(ad._id, true);
    try {
      await axios.delete(`https://backend-nu-livid-37.vercel.app/banners/${ad._id}`);
      Swal.fire("Removed", "Removed from slider", "success");
      fetchData();
    } catch {
      Swal.fire("Error", "Failed to remove from slider", "error");
    } finally {
      setProcessing(ad._id, false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-600 text-lg">Loading...</p>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        Manage Banner Advertisements
      </h2>

      {ads.length === 0 ? (
        <p className="text-gray-500 text-center">No advertisements found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="p-3 border">Image</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Seller Email</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => {
                const inSlider = isInSlider(ad);
                const isProcessing = processingIds.has(ad._id);
                return (
                  <tr key={ad._id} className="hover:bg-gray-50 border-t">
                    <td className="p-3 border">
                      <img
                        src={ad.imageURL}
                        alt={ad.name}
                        className="h-16 w-16 object-cover rounded shadow mx-auto"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/64?text=No+Image";
                        }}
                      />
                    </td>
                    <td className="p-3 border">{ad.name}</td>
                    <td className="p-3 border">{ad.description}</td>
                    <td className="p-3 border">{ad.email}</td>
                    <td className="p-3 border text-center">
                      {inSlider ? (
                        <button
                          disabled={isProcessing}
                          onClick={() => removeFromSlider(ad)}
                          className={`px-3 py-1 text-sm rounded text-white ${
                            isProcessing
                              ? "bg-red-300 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          {isProcessing ? "Removing..." : "Remove from Slide"}
                        </button>
                      ) : (
                        <button
                          disabled={isProcessing}
                          onClick={() => addToSlider(ad)}
                          className={`px-3 py-1 text-sm rounded text-white ${
                            isProcessing
                              ? "bg-blue-300 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          
                          {isProcessing ? "Adding..." : "Add to Slide"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageBanners;
