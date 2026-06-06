"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore/lite';

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscribers() {
      try {
        const q = query(collection(db, 'subscribers'), orderBy('dateJoined', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedSubscribers = [];
        querySnapshot.forEach((doc) => {
          fetchedSubscribers.push({ id: doc.id, ...doc.data() });
        });
        setSubscribers(fetchedSubscribers);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSubscribers();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-gray-500">Loading subscribers...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#4A2C2A]">Newsletter Subscribers</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {subscribers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No subscribers yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm uppercase tracking-wider text-gray-500">
                  <th className="p-4 font-semibold">Email Address</th>
                  <th className="p-4 font-semibold text-right">Date Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subscribers.map(sub => {
                  let dateFormatted = 'Unknown Date';
                  if (sub.dateJoined) {
                    if (sub.dateJoined.toDate) {
                      dateFormatted = sub.dateJoined.toDate().toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                    } else if (typeof sub.dateJoined === 'string') {
                      dateFormatted = sub.dateJoined;
                    }
                  }

                  return (
                    <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{sub.email}</div>
                      </td>
                      <td className="p-4 text-right text-gray-500 text-sm">
                        {dateFormatted}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
