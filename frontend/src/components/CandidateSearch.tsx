import React, { useState } from 'react';

interface FilterOptions {
  educationLevel: string;
  yearsOfExperience: string;
  location: string;
  availability: string;
  skills: string[];
}

const CandidateSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    educationLevel: '',
    yearsOfExperience: '',
    location: '',
    availability: '',
    skills: []
  });
  const [savedSearches, setSavedSearches] = useState<string[]>([
    'Frontend Developers in New York',
    'Senior Java Engineers',
    'UX/UI Designers with 5+ years'
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillChange = (skill: string) => {
    if (filters.skills.includes(skill)) {
      setFilters(prev => ({
        ...prev,
        skills: prev.skills.filter(s => s !== skill)
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSaveSearch = () => {
    if (searchQuery.trim() !== '') {
      setSavedSearches(prev => [...prev, searchQuery]);
      alert('Search saved successfully!');
    }
  };

  const handleApplySearch = (savedSearch: string) => {
    setSearchQuery(savedSearch);
    // In a real application, this would trigger the search with the saved parameters
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Search Candidates</h2>
      
      {/* Main Search Bar */}
      <div className="flex mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name, skills, or experience..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="absolute right-2 top-2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <button 
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          {showAdvancedFilters ? 'Hide Filters' : 'Advanced Filters'}
        </button>
        <button 
          className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          onClick={handleSaveSearch}
        >
          Save Search
        </button>
      </div>
      
      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-3">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
              <select 
                name="educationLevel" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={filters.educationLevel}
                onChange={handleFilterChange}
              >
                <option value="">Any</option>
                <option value="high_school">High School</option>
                <option value="associate">Associate Degree</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="phd">PhD</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <select 
                name="yearsOfExperience" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={filters.yearsOfExperience}
                onChange={handleFilterChange}
              >
                <option value="">Any</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input 
                type="text" 
                name="location" 
                placeholder="City, State, or Remote"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select 
                name="availability" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={filters.availability}
                onChange={handleFilterChange}
              >
                <option value="">Any</option>
                <option value="immediate">Immediate</option>
                <option value="2_weeks">2 weeks</option>
                <option value="1_month">1 month</option>
                <option value="3_months">3+ months</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
            <div className="flex flex-wrap gap-2">
              {['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'UX/UI', 'Project Management'].map(skill => (
                <button
                  key={skill}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.skills.includes(skill) 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => handleSkillChange(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition mr-2">
              Reset Filters
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Saved Searches</h3>
          <div className="flex flex-wrap gap-2">
            {savedSearches.map((search, index) => (
              <button
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
                onClick={() => handleApplySearch(search)}
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Search Results would go here */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold">Search Results</h3>
        </div>
        <div className="p-4">
          <p className="text-gray-500 text-center py-8">
            Enter a search query and apply filters to see candidate results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CandidateSearch; 