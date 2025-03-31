import React, { useState, useEffect } from 'react';
import { getAllChallenges, getAllCategories } from '../api/exportAllApi';

function PublicChallenge() {
  const [challenges, setChallenges] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: ''
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [challengesData, categoriesData] = await Promise.all([
          getAllChallenges(),
          getAllCategories()
        ]);
        
        setChallenges(challengesData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to load challenges');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredChallenges = challenges.filter(challenge => {
    // Filter by category
    if (filters.category && challenge.categoryId !== filters.category) {
      return false;
    }
    
    // Filter by difficulty
    if (filters.difficulty && challenge.difficulty !== filters.difficulty) {
      return false;
    }
    
    // Filter by search term
    if (filters.search && !challenge.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Public Challenges</h1>
      
      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="difficulty">
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.difficulty}
              onChange={handleFilterChange}
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="search">
              Search
            </label>
            <input
              id="search"
              name="search"
              type="text"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by title"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>
      
      {/* Challenge List */}
      {filteredChallenges.length === 0 ? (
        <div className="text-center p-8 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-bold mb-2">No Challenges Found</h2>
          <p className="text-gray-600">Try adjusting your filters or check back later for new challenges.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map(challenge => (
            <div key={challenge.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 truncate">{challenge.title}</h2>
                
                <div className="flex items-center mb-4">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 ${
                    challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {challenge.difficulty?.charAt(0).toUpperCase() + challenge.difficulty?.slice(1) || 'Medium'}
                  </span>
                  
                  <span className="text-gray-600 text-sm">
                    {challenge.participantsCount || 0} participants
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3">{challenge.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Ends: {new Date(challenge.endDate).toLocaleDateString()}
                  </span>
                  
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicChallenge;