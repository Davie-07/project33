import React from 'react';
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <h1 className="text-4xl font-bold text-center py-8">Next4Us Team</h1>
        <p className="text-center text-lg mb-8">Member Management System</p>
        {/* Add your main application content here */}
      </div>
    </Layout>
  );
}

export default App;
