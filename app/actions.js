// app/actions.js
"use server"; 

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// 1. Function to add a new review (with photo upload)
export async function addReview(formData) {
  const messId = formData.get("messId"); 
  const rating = parseInt(formData.get("rating")); 
  const comment = formData.get("comment"); 
  const photo = formData.get("photo");

  if (!messId || isNaN(rating)) return;

  let photoUrl = null;

  if (photo && photo.size > 0) {
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueFileName = `${Date.now()}-${photo.name}`;
    const filepath = path.join(process.cwd(), "public", "uploads", uniqueFileName);

    await writeFile(filepath, buffer);
    photoUrl = `/uploads/${uniqueFileName}`;
  }

  await prisma.review.create({
    data: {
      rating: rating,
      comment: comment,
      photoUrl: photoUrl,
      messId: messId, 
    },
  });

  revalidatePath(`/mess/${messId}`);
}

// 2. Function to upvote a review
export async function upvoteReview(reviewId, messId) {
  await prisma.review.update({
    where: { id: reviewId },
    data: {
      helpfulCount: {
        increment: 1, 
      },
    },
  });

  revalidatePath(`/mess/${messId}`);
}

// 3. Function to add an owner's reply
export async function addOwnerReply(formData) {
  const reviewId = formData.get("reviewId");
  const messId = formData.get("messId");
  const replyText = formData.get("replyText");

  if (!reviewId || !replyText) return;

  await prisma.review.update({
    where: { id: reviewId },
    data: {
      ownerReply: replyText,
    },
  });

  // Refresh the page so the owner's reply shows up immediately
  revalidatePath(`/mess/${messId}`);
}