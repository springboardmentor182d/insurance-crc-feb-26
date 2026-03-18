
import React from 'react';
import PageContainer from './layout/PageContainer';
import DashboardPage from './pages/Dashboard'; // The path must start with ./pages/

function App() {
  return (
    <PageContainer>
      <DashboardPage />
    </PageContainer>
  );
}

export default App;