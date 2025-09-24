import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const History = () => {
  const { user } = useAuth();
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      try {
        // Using uid from user object to query history
        const response = await axios.get('http://localhost:5000/api/history', {
          params: { uid: user.uid }
        });
        setHistoryItems(response.data);
      } catch (err) {
        setError('Failed to fetch history. Please try again later.');
        console.error('Fetch history error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user]); // Re-run effect if the user object changes

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">My Ledger History</h1>
      {historyItems.length === 0 ? (
        <p>You have no saved ledger history yet. Go to the homepage to upload your first one!</p>
      ) : (
        <div className="space-y-6">
          {historyItems.map((item) => (
            <div key={item._id} className="card lg:card-side bg-base-100 shadow-xl">
              <figure className="lg:w-1/3">
                {/* Construct the full URL for the image */}
                <img 
                  src={`http://localhost:5000${item.imagePath}`} 
                  alt="Ledger upload" 
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body lg:w-2/3">
                <h2 className="card-title">
                  Ledger from: {new Date(item.createdAt).toLocaleString()}
                </h2>
                <div className="overflow-x-auto mt-4">
                  {Array.isArray(item.aiResult) && item.aiResult.length > 0 ? (
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th>Quantity</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.aiResult.map((res, index) => (
                          <tr key={index}>
                            <td>{res.itemName || 'N/A'}</td>
                            <td>{res.quantity || 'N/A'}</td>
                            <td>{res.price || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No structured data was found for this entry.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
