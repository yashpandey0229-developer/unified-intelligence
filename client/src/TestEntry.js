import React, { useState } from 'react';
import axios from 'axios';

export default function TestEntry() {
  const [text, setText] = useState("");
  const submit = () => {
    axios.post('http://localhost:8082/api/complaints/process', { text })
      .then(() => alert("Complaint Registered!"))
      .catch(err => console.log(err));
  };

  return (
    <div className="p-10 bg-white border-t-4 border-blue-600 shadow-xl rounded-2xl max-w-md mx-auto mt-10">
      <h3 className="text-xl font-bold mb-4">Register New Complaint</h3>
      <textarea 
        className="w-full border p-3 rounded-xl mb-4 h-32 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Type a complaint to test the AI..."
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={submit} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
        Process with Gemini AI
      </button>
    </div>
  );
}