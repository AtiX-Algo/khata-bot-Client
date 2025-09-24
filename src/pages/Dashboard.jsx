import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        // Send uid as query param instead of token
        const response = await axios.get('http://localhost:5000/api/dashboard/monthly', {
          params: { uid: user.uid }
        });
        setData(response.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

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

  const chartData = data?.bestSellers?.slice(0, 10).map(item => ({
    name: item._id,
    Revenue: item.totalRevenue,
  })) || [];

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">
        Monthly Dashboard ({new Date().toLocaleString('default', { month: 'long' })})
      </h1>

      {/* Stats Cards */}
      <div className="stats shadow w-full md:w-1/3 mb-8">
        <div className="stat">
          <div className="stat-title">Total Monthly Revenue</div>
          <div className="stat-value text-primary">
            ৳{data?.totalMonthlyRevenue?.toFixed(2)}
          </div>
          <div className="stat-desc">Revenue from all sales this month</div>
        </div>
      </div>

      {/* Best Sellers Chart */}
      <h2 className="text-2xl font-bold mb-4">
        Top 10 Best-Selling Products (by Revenue)
      </h2>
      {chartData.length > 0 ? (
        <div className="w-full h-96 bg-base-100 p-4 rounded-lg shadow">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `৳${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="Revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p>No sales data available for this month to generate a chart.</p>
      )}

      {/* AI Insights */}
      {data?.aiInsights && (
        <div className="mt-6 p-4 bg-base-200 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">AI Insights</h3>
          <p>{data.aiInsights}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
