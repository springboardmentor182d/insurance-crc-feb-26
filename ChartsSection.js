import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ChartsSection = () => {
  // Claims Status Data
  const claimsData = {
    labels: ['Pending', 'Approved', 'Rejected', 'Under Review'],
    datasets: [
      {
        label: 'Number of Claims',
        data: [234, 1892, 156, 89],
        backgroundColor: [
          'rgba(243, 156, 18, 0.8)',
          'rgba(39, 174, 96, 0.8)',
          'rgba(231, 76, 60, 0.8)',
          'rgba(52, 152, 219, 0.8)'
        ],
        borderColor: [
          'rgba(243, 156, 18, 1)',
          'rgba(39, 174, 96, 1)',
          'rgba(231, 76, 60, 1)',
          'rgba(52, 152, 219, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const claimsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Claims Status Overview',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  // Policy Distribution Data
  const policyData = {
    labels: ['Health Insurance', 'Life Insurance', 'Auto Insurance', 'Home Insurance', 'Travel Insurance'],
    datasets: [
      {
        label: 'Policies',
        data: [3245, 2156, 1876, 945, 210],
        backgroundColor: [
          'rgba(52, 152, 219, 0.8)',
          'rgba(155, 89, 182, 0.8)',
          'rgba(241, 196, 15, 0.8)',
          'rgba(46, 204, 113, 0.8)',
          'rgba(230, 126, 34, 0.8)'
        ],
        borderColor: [
          'rgba(52, 152, 219, 1)',
          'rgba(155, 89, 182, 1)',
          'rgba(241, 196, 15, 1)',
          'rgba(46, 204, 113, 1)',
          'rgba(230, 126, 34, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const policyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Policy Distribution',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    }
  };

  return (
    <div className="charts-grid">
      <div className="chart-container">
        <Bar data={claimsData} options={claimsOptions} height={300} />
      </div>
      
      <div className="chart-container">
        <Pie data={policyData} options={policyOptions} height={300} />
      </div>
    </div>
  );
};

export default ChartsSection;
