import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand Section */}
          <div className="space-y-3">
            <a href="/" className="text-2xl font-bold text-gray-800 dark:text-white">
              CareerHub
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Empowering your career journey with the best opportunities and resources.
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Quick Links</h3>
              <nav className="flex flex-col space-y-2">
                <a href="https://www.careerhubs.info/about-us" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors">About Us</a>
                <a href="https://jobs.careerhubs.info/" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors">Job Listings</a>
                <a href="https://jobs.careerhubs.info/" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors">Employers</a>
                <a href="https://www.careerhubs.info/resources" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors">Career Resources</a>
              </nav>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Support</h3>
              <nav className="flex flex-col space-y-2">
                <a href="https://www.careerhubs.info/contact-us" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors">Contact Us</a>
                <a href="https://www.careerhubs.info" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors">FAQs</a>
                <a href="https://www.careerhubs.info/privacy-policy" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors">Privacy Policy</a>
                <a href="https://www.careerhubs.info/about-us" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors">Terms of Service</a>
              </nav>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Stay Updated</h3>
            <p className="textsm text-gray-500 dark:text-gray-400 leading-relaxed">
              Get the latest job opportunities and career advice directly to your inbox.
            </p>
            <form className="flex flex-col space-y-2">
              <div className="relative w-3/4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="pl-3 pr-20 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm w-full"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-lg transition-colors"
                >
                  <FaArrowRight />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-6 pt-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} CareerHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
