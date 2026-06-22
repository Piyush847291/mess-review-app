// app/actions.js
"use server"; 

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises"; // File save karne ke liye
import path from "path";

const prisma = new PrismaClient();

export async function addReview(formData) {
  const messId = formData.get("messId"); 
  const rating = parseInt(formData.get("rating")); 
  const comment = formData.get("comment"); 
  const photo = formData.get("photo"); // Form se photo file nikaalna

  if (!messId || isNaN(rating)) return;

  let photoUrl = null;

  // Agar user ne photo select ki hai (size 0 se zyada hai)
  if (photo && photo.size > 0) {
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Photo ka ek unique naam banayein taaki purani photos par overwrite na ho
    const uniqueFileName = `${Date.now()}-${photo.name}`;
    
    // File ko kahan save karna hai uska path (public/uploads/...)
    const filepath = path.join(process.cwd(), "public", "uploads", uniqueFileName);

    // File ko physically folder mein save karna
    await writeFile(filepath, buffer);
    
    // Database mein save karne ke liye public link generate karna
    photoUrl = `/uploads/${uniqueFileName}`;
  }

  // Database mein data daalna
  await prisma.review.create({
    data: {
      rating: rating,
      comment: comment,
      photoUrl: photoUrl, // Photo ka link yahan save hoga
      messId: messId, 
    },
  });

  revalidatePath(`/mess/${messId}`);
}
// Add this at the bottom of your app/actions.js file

export async function upvoteReview(reviewId, messId) {
  // Database mein us specific review ko dhoondh kar uska count 1 se bada do (+1)
  await prisma.review.update({
    where: { id: reviewId },
    data: {
      helpfulCount: {
        increment: 1, 
      },
    },
  });

  // Page ko refresh karo taaki naya count turant dikh jaye
  revalidatePath(`/mess/${messId}`);
}