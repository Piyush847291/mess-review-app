// app/components/OwnerReplyForm.jsx
"use client";

import { useRef } from "react";
import { addOwnerReply } from "../actions";

export default function OwnerReplyForm({ reviewId, messId }) {
  const formRef = useRef(null);

  return (
    <form 
      ref={formRef}
      action={async (formData) => {
        await addOwnerReply(formData);
        formRef.current.reset();
      }}
      className="mt-4 flex gap-2 items-center bg-slate-100 p-3 rounded-md border border-slate-200"
    >
      <input type="hidden" name="reviewId" value={reviewId} />
      <input type="hidden" name="messId" value={messId} />
      
      <span className="text-xl">👨‍🍳</span>
      <input 
        type="text" 
        name="replyText" 
        required
        placeholder="Reply as Mess Owner..." 
        className="flex-1 bg-white border border-slate-300 p-2 rounded text-sm outline-blue-500"
      />
      <button 
        type="submit" 
        className="bg-slate-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-700 transition-colors"
      >
        Post Reply
      </button>
    </form>
  );
}