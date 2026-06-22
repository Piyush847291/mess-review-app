// app/components/UpvoteButton.jsx
"use client";

import { useState } from "react";
import { upvoteReview } from "../actions";

export default function UpvoteButton({ reviewId, messId, initialCount }) {
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVote = async () => {
    if (hasVoted) return; // Prevent clicking multiple times
    
    setLoading(true);
    await upvoteReview(reviewId, messId); // Call backend
    setHasVoted(true); // Change button color
    setLoading(false);
  };

  return (
    <button
      onClick={handleVote}
      disabled={hasVoted || loading}
      className={`mt-4 text-sm flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all ${
        hasVoted
          ? "bg-blue-50 border-blue-200 text-blue-700 font-medium"
          : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
      }`}
    >
      👍 {hasVoted ? "Helpful" : "Helpful?"} 
      <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs font-bold">
        {initialCount + (hasVoted ? 1 : 0)}
      </span>
    </button>
  );
}