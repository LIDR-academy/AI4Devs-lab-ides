import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CandidateReports: React.FC = () => {
  const [dateRange, setDateRange] = useState('last_30_days');
  const [position, setPosition] = useState('all');
  const [department, setDepartment] = useState('all');
  
  // Sample data for charts
  const candidatesPerPositionData = [
    { name: 'Frontend Developer', value: 24 },
    { name: 'Backend Developer', value: 18 },
    { name: 'UX Designer', value: 12 },
    { name: 'Project Manager', value: 8 },
    { name: 'DevOps Engineer', value: 6 },
  ];
  
  const timeInStageData = [
    { name: 'Application', days: 2 },
    { name: 'CV Review', days: 3 },
    { name: 'Initial Interview', days: 5 },
    { name: 'Technical Test', days: 7 },
    { name: 'Final Interview', days: 4 },
    { name: 'Offer', days: 3 },
  ];
  
  const conversionRateData = [
    { name: 'Application to CV Review', rate: 75 },
    { name: 'CV Review to Interview', rate: 60 },
    { name: 'Interview to Technical', rate: 50 },
    { name: 'Technical to Final', rate: 70 },
    { name: 'Final to Offer', rate: 80 },
    { name: 'Offer to Hired', rate: 90 },
  ];
  
  const sourcesData = [
    { name: 'LinkedIn', value: 35 },
    { name: 'Job Boards', value: 25 },
    { name: 'Referrals', value: 20 },
    { name: 'Company Website', value: 15 },
    { name: 'Other', value: 5 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  const handleExport = (format: string) => {
    alert(`Exporting report in ${format} format...`);
    // In a real application, this would trigger the export functionality
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Candidate Reports</h2>
        <div className="flex space-x-2">
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => handleExport('pdf')}
          >
            Export PDF
          </button>
          <button 
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
            onClick={() => handleExport('excel')}
          >
            Export Excel
          </button>
          <button 
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            onClick={() => handleExport('csv')}
          >
            Export CSV
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_90_days">Last 90 Days</option>
              <option value="year_to_date">Year to Date</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            >
              <option value="all">All Positions</option>
              <option value="frontend">Frontend Developer</option>
              <option value="backend">Backend Developer</option>
              <option value="ux">UX Designer</option>
              <option value="pm">Project Manager</option>
              <option value="devops">DevOps Engineer</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="engineering">Engineering</option>
              <option value="design">Design</option>
              <option value="product">Product</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Candidates per Position */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-4">Candidates per Position</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={candidatesPerPositionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Average Time in Stage */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-4">Average Time in Stage (Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeInStageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="days" stroke="#3B82F6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Conversion Rates */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-4">Conversion Rates Between Stages (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="rate" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Recruitment Sources */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-4">Recruitment Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sourcesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {sourcesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Summary Table */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold mb-4">Recruitment Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Candidates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Process</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hired</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rejected</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Time to Hire (Days)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Frontend Developer</td>
                <td className="px-6 py-4 whitespace-nowrap">24</td>
                <td className="px-6 py-4 whitespace-nowrap">15</td>
                <td className="px-6 py-4 whitespace-nowrap">5</td>
                <td className="px-6 py-4 whitespace-nowrap">4</td>
                <td className="px-6 py-4 whitespace-nowrap">21</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Backend Developer</td>
                <td className="px-6 py-4 whitespace-nowrap">18</td>
                <td className="px-6 py-4 whitespace-nowrap">10</td>
                <td className="px-6 py-4 whitespace-nowrap">4</td>
                <td className="px-6 py-4 whitespace-nowrap">4</td>
                <td className="px-6 py-4 whitespace-nowrap">25</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">UX Designer</td>
                <td className="px-6 py-4 whitespace-nowrap">12</td>
                <td className="px-6 py-4 whitespace-nowrap">6</td>
                <td className="px-6 py-4 whitespace-nowrap">3</td>
                <td className="px-6 py-4 whitespace-nowrap">3</td>
                <td className="px-6 py-4 whitespace-nowrap">18</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Project Manager</td>
                <td className="px-6 py-4 whitespace-nowrap">8</td>
                <td className="px-6 py-4 whitespace-nowrap">4</td>
                <td className="px-6 py-4 whitespace-nowrap">2</td>
                <td className="px-6 py-4 whitespace-nowrap">2</td>
                <td className="px-6 py-4 whitespace-nowrap">30</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">DevOps Engineer</td>
                <td className="px-6 py-4 whitespace-nowrap">6</td>
                <td className="px-6 py-4 whitespace-nowrap">3</td>
                <td className="px-6 py-4 whitespace-nowrap">1</td>
                <td className="px-6 py-4 whitespace-nowrap">2</td>
                <td className="px-6 py-4 whitespace-nowrap">28</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CandidateReports; 