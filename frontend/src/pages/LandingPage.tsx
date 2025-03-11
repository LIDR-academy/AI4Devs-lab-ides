import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiSearch, FiCheckCircle, FiBarChart2, FiShield } from 'react-icons/fi';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-steel-blue-600 rounded-full flex items-center justify-center mr-3">
              <FiUsers className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-steel-blue-800">ATS System</h1>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-steel-blue-600 hover:bg-steel-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-steel-blue-500 transition-colors duration-200"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-steel-blue-700 to-steel-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                Simplify Your Recruitment Process
              </h2>
              <p className="text-xl md:text-2xl text-steel-blue-100 mb-8">
                Our Applicant Tracking System helps you manage candidates efficiently, streamline your hiring workflow, and make better recruitment decisions.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-steel-blue-800 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-200"
              >
                Get Started
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt="Recruitment team"
                className="rounded-lg shadow-xl max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Powerful Features for Modern Recruiters
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our ATS platform provides everything you need to streamline your recruitment process from start to finish.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-steel-blue-100 rounded-md flex items-center justify-center mb-4">
                <FiUsers className="h-6 w-6 text-steel-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Candidate Management</h3>
              <p className="text-gray-600">
                Easily add, organize, and track candidates throughout the entire recruitment process.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-steel-blue-100 rounded-md flex items-center justify-center mb-4">
                <FiSearch className="h-6 w-6 text-steel-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Search</h3>
              <p className="text-gray-600">
                Quickly find the right candidates with powerful search and filtering capabilities.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-steel-blue-100 rounded-md flex items-center justify-center mb-4">
                <FiCheckCircle className="h-6 w-6 text-steel-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Streamlined Workflow</h3>
              <p className="text-gray-600">
                Customize your recruitment pipeline to match your company's unique hiring process.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-steel-blue-100 rounded-md flex items-center justify-center mb-4">
                <FiBarChart2 className="h-6 w-6 text-steel-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics & Reporting</h3>
              <p className="text-gray-600">
                Gain insights into your recruitment process with comprehensive analytics and reports.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-steel-blue-100 rounded-md flex items-center justify-center mb-4">
                <FiShield className="h-6 w-6 text-steel-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Security</h3>
              <p className="text-gray-600">
                Keep candidate information secure with our robust data protection measures.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-steel-blue-100 rounded-md flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-steel-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">GDPR Compliant</h3>
              <p className="text-gray-600">
                Our platform is fully compliant with GDPR and other data protection regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Trusted by Recruiters Worldwide
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers have to say about our ATS platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-steel-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-steel-blue-600 font-bold">JD</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">John Doe</h4>
                  <p className="text-gray-600 text-sm">HR Manager, Tech Corp</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "This ATS has transformed our recruitment process. We're now able to find and hire top talent much faster than before."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-steel-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-steel-blue-600 font-bold">JS</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Jane Smith</h4>
                  <p className="text-gray-600 text-sm">Talent Acquisition, Global Inc</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The analytics and reporting features have given us valuable insights into our recruitment process, helping us make data-driven decisions."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-steel-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-steel-blue-600 font-bold">RJ</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Robert Johnson</h4>
                  <p className="text-gray-600 text-sm">Recruiting Director, Startup XYZ</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The customizable workflow has been a game-changer for us. We've been able to adapt the system to our unique recruitment needs."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-steel-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl mb-6">
            Ready to Transform Your Recruitment Process?
          </h2>
          <p className="text-xl text-steel-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of recruiters who are already using our ATS platform to streamline their hiring process.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-steel-blue-800 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-200"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-steel-blue-600 rounded-full flex items-center justify-center mr-3">
                  <FiUsers className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">ATS System</h3>
              </div>
              <p className="text-gray-400">
                Simplifying recruitment processes for modern HR teams.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Candidate Management</li>
                <li>Advanced Search</li>
                <li>Workflow Customization</li>
                <li>Analytics & Reporting</li>
                <li>Data Security</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Blog</li>
                <li>Case Studies</li>
                <li>Support Center</li>
                <li>Webinars</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ATS System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 