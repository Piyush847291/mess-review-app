// app/mess/[id]/page.jsx
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import ReviewForm from "../../components/ReviewForm";
import UpvoteButton from "../../components/UpvoteButton";
import OwnerReplyForm from "../../components/OwnerReplyForm"; // NEW: Import the reply form

const prisma = new PrismaClient();

export default async function MessDetail({ params }) {
  const resolvedParams = await params;
  const currentId = resolvedParams.id;

  const mess = await prisma.mess.findUnique({
    where: { id: currentId },
    include: { reviews: { orderBy: { createdAt: "desc" } } }
  });

  if (!mess) return <div className="p-8 text-center text-red-500 text-2xl font-bold">Mess not found!</div>;

  // Calculate Average Rating
  const totalReviews = mess.reviews.length;
  const avgRating = totalReviews > 0 
    ? (mess.reviews.reduce((sum, rev) => sum + rev.rating, 0) / totalReviews).toFixed(1) 
    : "0.0";

  return (
    <main className="max-w-4xl mx-auto p-8 min-h-screen font-sans text-slate-800 bg-slate-50">
      <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block font-medium">
        &larr; Back to Dashboard
      </Link>

      {/* Mess Details Header */}
      <div className="bg-slate-900 text-white p-8 rounded-xl shadow-md mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">{mess.name}</h1>
          <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-semibold inline-block mt-1">
            {mess.type}
          </span>
        </div>
      </div>

      {/* Rating Analytics Section */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mb-8 flex flex-col md:flex-row gap-8 items-center">
        <div className="text-center md:border-r md:pr-8 border-slate-200">
          <div className="text-5xl font-extrabold text-slate-800 mb-1">{avgRating}</div>
          <div className="text-amber-500 text-2xl mb-1">{"⭐".repeat(Math.round(avgRating))}</div>
          <div className="text-sm text-slate-500 font-medium">{totalReviews} Ratings</div>
        </div>

        <div className="flex-1 w-full">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = mess.reviews.filter((r) => r.rating === star).length;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

            return (
              <div key={star} className="flex items-center gap-3 mb-2">
                <span className="w-12 text-sm font-medium text-slate-600 text-right">{star} ⭐</span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${star >= 4 ? 'bg-green-500' : star === 3 ? 'bg-amber-400' : 'bg-red-500'}`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="w-8 text-sm text-slate-500">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Form Component */}
      <ReviewForm messId={mess.id} />

      {/* Reviews List */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-2xl font-bold mb-6 border-b pb-3">Student Reviews</h2>
        
        {mess.reviews.length === 0 ? (
          <p className="text-slate-500 italic text-center py-4">No reviews yet. Be the first to review this mess!</p>
        ) : (
          <ul className="space-y-6">
            {mess.reviews.map((review) => (
              <li key={review.id} className="bg-slate-50 p-5 rounded-lg border border-slate-100 shadow-sm">
                
                <div className="flex justify-between items-center mb-2">
                  <div className="flex gap-2 font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded">
                    {review.rating} ⭐
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {review.comment && (
                  <p className="text-slate-700 mt-2 text-lg">{review.comment}</p>
                )}
                
                {review.photoUrl && (
                  <div className="mt-4">
                    <img 
                      src={review.photoUrl} 
                      alt="Mess Food Proof" 
                      className="h-64 w-full md:w-2/3 object-cover rounded-lg border border-slate-300 shadow-sm"
                    />
                  </div>
                )}
                
                <UpvoteButton 
                  reviewId={review.id} 
                  messId={mess.id} 
                  initialCount={review.helpfulCount} 
                />

                {/* NEW: Owner Reply Logic */}
                {review.ownerReply ? (
                  <div className="mt-5 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">👨‍🍳</span>
                      <span className="font-bold text-blue-900 text-sm">Response from Mess Owner</span>
                    </div>
                    <p className="text-blue-800 text-sm italic">"{review.ownerReply}"</p>
                  </div>
                ) : (
                  <OwnerReplyForm reviewId={review.id} messId={mess.id} />
                )}
                
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}