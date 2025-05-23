// Dashboard.jsx
import React, { useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import useDetailsStore from '../Store/DetailStore'; // Adjust path as needed
import usePlaceStore from '../Store/PlaceStore'; // Adjust path as needed
import useCategoryStore from '../Store/CategoryStore'; // Adjust path as needed

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { details, adddetails } = useDetailsStore();
  const { places, addPlace } = usePlaceStore();
  const { categories, addCategory } = useCategoryStore();

  // Sample data initialization (run once on mount if stores are empty)
  useEffect(() => {
    if (places.length === 0) {
      addPlace({ id: '1', name: 'Paris' });
      addPlace({ id: '2', name: 'Tokyo' });
    }
    if (categories.length === 0) {
      addCategory({ id: '1', name: 'Historical' });
      addCategory({ id: '2', name: 'Modern' });
    }
    if (details.length === 0) {
      adddetails({ id: '1', placeId: '1', categoryId: '1', name: 'Eiffel Tower' });
      adddetails({ id: '2', placeId: '1', categoryId: '1', name: 'Louvre Museum' });
      adddetails({ id: '3', placeId: '2', categoryId: '2', name: 'Shibuya Crossing' });
    }
  }, [places, categories, details, addPlace, addCategory, adddetails]);

  // Data for Bar Chart: Number of details per place
  const barChartData = {
    type: 'bar',
    data: {
      labels: places.map((place) => place.name),
      datasets: [
        {
          label: 'Details per Place',
          data: places.map(
            (place) => details.filter((detail) => detail.placeId === place.id).length
          ),
          backgroundColor: ['#4C78DD', '#F4A261'],
          borderColor: ['#3B5BA9', '#D97706'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Details per Place' },
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Number of Details' } },
        x: { title: { display: true, text: 'Places' } },
      },
    },
  };

  // Data for Pie Chart: Distribution of categories
  const pieChartData = {
    type: 'pie',
    data: {
      labels: categories.map((category) => category.name),
      datasets: [
        {
          label: 'Category Distribution',
          data: categories.map(
            (category) => details.filter((detail) => detail.categoryId === category.id).length
          ),
          backgroundColor: ['#4C78DD', '#F4A261', '#2CA02C', '#D62728'],
          borderColor: ['#FFFFFF'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Category Distribution' },
      },
    },
  };

  return (
    <>
<div className="p-6 bg-gray-100 min-h-screen">
    <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      {/* Data Tables */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Places Table */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Places</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
              </tr>
            </thead>
            <tbody>
              {places.map((place) => (
                <tr key={place.id} className="border-b">
                  <td className="p-2">{place.id}</td>
                  <td className="p-2">{place.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Categories Table */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b">
                  <td className="p-2">{category.id}</td>
                  <td className="p-2">{category.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Details Table */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Details</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Place</th>
                <th className="p-2">Category</th>
              </tr>
            </thead>
            <tbody>
              {details.map((detail) => (
                <tr key={detail.id} className="border-b">
                  <td className="p-2">{detail.id}</td>
                  <td className="p-2">{detail.name}</td>
                  <td className="p-2">
                    {places.find((place) => place.id === detail.placeId)?.name || 'N/A'}
                  </td>
                  <td className="p-2">
                    {categories.find((cat) => cat.id === detail.categoryId)?.name || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Details per Place</h2>
          <div className="h-80">
            <Bar data={barChartData.data} options={barChartData.options} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
          <div className="h-80">
            <Pie data={pieChartData.data} options={pieChartData.options} />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};



export default Dashboard;