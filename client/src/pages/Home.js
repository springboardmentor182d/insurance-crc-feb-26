import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Calling your specific dashboard endpoint
    fetch('http://127.0.0.1:8000/api/users/dashboard/summary/1')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error('Error connecting:', error));
  }, []);

  return (
    <div>
      {/* Now you can use {data.summary.active_policies} in your HTML! */}
      <h1>Active Policies: {data?.summary?.active_policies}</h1>
    </div>
  );
};