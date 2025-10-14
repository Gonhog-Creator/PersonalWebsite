'use client';

import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function ComplaintsPage() {
  const [complaint, setComplaint] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [complaintCount, setComplaintCount] = useState(0);

  useEffect(() => {
    // Initialize counter from localStorage
    const count = localStorage.getItem('complaintCount');
    if (count) {
      setComplaintCount(parseInt(count, 10));
    } else {
      // Initialize if not exists
      localStorage.setItem('complaintCount', '0');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setComplaint('');
    
    // Increment and update the counter
    const newCount = complaintCount + 1;
    setComplaintCount(newCount);
    localStorage.setItem('complaintCount', newCount.toString());
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <Head>
        <title>Complaints Department | josebarbeito.com</title>
        <meta name="description" content="Submit your complaints here. Not that we'll read them." />
      </Head>

      <div className="w-full max-w-lg bg-gray-700 text-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform hover:shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Complaints Department</h1>
          <p className="text-indigo-100">We pretend to care, but we don&apos;t.</p>
        </div>
        
        <div className="p-8">

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="complaint" className="block text-center text-lg font-medium text-gray-200 mb-4">
                Your Complaint, if you must
              </label>
              <div className="mt-1">
                <textarea
                  id="complaint"
                  name="complaint"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white placeholder-gray-400 border border-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 resize-none"
                  placeholder=""
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Complaint
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-white mb-3">Thank you for your complaint!</h2>
            <div className="text-gray-400 text-sm mb-4">
              You are complaint number <span className="font-bold text-indigo-300">#{complaintCount}</span> in our system.
            </div>
            <p className="text-gray-300 mb-8 text-lg">It shall be thrown away immediately.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-indigo-300 hover:text-white font-medium text-sm uppercase tracking-wider hover:underline focus:outline-none transition-colors duration-200"
            >
              Submit another complaint? (Why would you?)
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
