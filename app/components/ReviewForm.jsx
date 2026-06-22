// app/components/ReviewForm.jsx
"use client";

import { useRef } from "react";
import { addReview } from "../actions";

export default function ReviewForm({ messId }) {
  const formRef = useRef(null);

  return (
    <form 
      ref={formRef}
      action={async (formData) => {
        await addReview(formData);
        formRef.current.reset(); // Submit hone ke baad form clear
      }} 
      className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8"
    >
      <h3 className="text-lg font-bold mb-4">Submit Your Review</h3>
      
      {/* Hidden input taaki backend ko pata chale kis mess ka review hai */}
      <input type="hidden" name="messId" value={messId} />
      
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Rating Dropdown */}
        <select 
          name="rating" 
          required 
          className="border border-gray-300 p-2 rounded text-black outline-blue-500 w-full md:w-1/3"
        >
          <option value="">Rating (1-5) ⭐</option>
          <option value="5">5 - Excellent</option>
          <option value="4">4 - Good</option>
          <option value="3">3 - Average</option>
          <option value="2">2 - Bad</option>
          <option value="1">1 - Terrible</option>
        </select>

        {/* Comment Input */}
        <input 
          type="text" 
          name="comment" 
          placeholder="How was the food? (Optional)" 
          className="border border-gray-300 p-2 rounded text-black outline-blue-500 flex-1"
        />
      </div>

      {/* Naya File Upload Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Upload Food Photo (Optional)
        </label>
        <input 
          type="file" 
          name="photo" 
          accept="image/*" 
          className="border border-gray-300 p-1.5 rounded text-black bg-white w-full"
        />
      </div>

      <button 
        type="submit" 
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full md:w-auto transition-colors"
      >
        Submit Review
      </button>
    </form>
  );
}