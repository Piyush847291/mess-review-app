// app/page.jsx
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function Home() {
  // 1. Auto-Seed (Agar database khali hai, toh 3 messes khud add kar do)
  const messCount = await prisma.mess.count();
  if (messCount === 0) {
    await prisma.mess.createMany({
      data: [
        { name: "Hostel A Mess (Boys)", type: "Pure Veg" },
        { name: "Hostel B Mess (Girls)", type: "Veg & Non-Veg" },
        { name: "Central Mess", type: "Non-Veg Only" },
      ],
    });
  }

  // 2. Data Fetching (Mess ke details aur unke reviews ek sath lana)
  const messes = await prisma.mess.findMany({
    include: {
      reviews: true, 
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* --- Header --- */}
      <header className="bg-white shadow-sm border-b px-8 py-6 mb-8">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-blue-700">
            Smart Mess Review <span className="text-xl inline-block ml-1">🍲</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            No Fake Reviews. 
          </p>
        </div>
      </header>

      {/* --- Main Content --- */}
      <div className="max-w-5xl mx-auto px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">College Mess Rankings</h2>
          <p className="text-slate-600">Click on any mess to view its details and reviews.</p>
        </div>

        {/* --- Mess Cards Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messes.map((mess) => {
            // Average Rating Calculate karna
            const totalReviews = mess.reviews.length;
            const sumRatings = mess.reviews.reduce((sum, rev) => sum + rev.rating, 0);
            const avgRating = totalReviews > 0 ? (sumRatings / totalReviews).toFixed(1) : "New";

            return (
              <div 
                key={mess.id} 
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold leading-tight">{mess.name}</h3>
                    {/* Rating Badge */}
                    <div className="bg-amber-100 text-amber-700 font-bold px-2 py-1 rounded text-sm flex items-center gap-1">
                      ⭐ {avgRating}
                    </div>
                  </div>
                  
                  {/* Tag */}
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-4 ${
                    mess.type.includes("Non-Veg") 
                      ? "bg-red-100 text-red-700" 
                      : "bg-green-100 text-green-700"
                  }`}>
                    {mess.type}
                  </span>
                  
                 <p className="text-sm text-slate-500 mb-6">
  {totalReviews} {totalReviews === 1 ? "student" : "students"} reviewed this.
</p>
                </div>

                {/* Yeh Link humein agle page par le jayega */}
                <Link 
                  href={`/mess/${mess.id}`} 
                  className="block w-full text-center bg-slate-900 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  View Reviews
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}