import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaSearch, FaTimes } from 'react-icons/fa';
import { FaTelegram } from 'react-icons/fa';

const NavBar = ({ onSearch }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleSearchBar = () => {
    setSearchBarOpen(!searchBarOpen);
    setSearchQuery('');
  };

  const closeSearchBar = () => {
    setSearchBarOpen(false);
    setSearchQuery('');
  };

  const handleInternshipSearch = () => {
    setSearchQuery('intern');
    onSearch('intern');
    setMenuOpen(false);
  };


  return (
    <>
      <nav className="border-b-2 border-gray-200 dark:border-gray-700 shadow-md fixed top-0 left-0 right-0 z-10 dark:text-white backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-14">
          <div className="flex lg:flex-1">
              <Link to="https://careerhubs.info/" className="-m-1 p-1 flex items-center space-x-2">
                <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">
                  CareerHub
                </div>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button
                  onClick={handleInternshipSearch}
                  className="text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium dark:text-white"
                >
                  Internships
                </button>
                <a href="https://t.me/careerhub_job" className="text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium dark:text-white flex items-center">
                  Job Alerts
                  <FaTelegram className="ml-1 w-4 h-4" />
                </a>
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search jobs here"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white h-8"
                    />
                    <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none">
                      <FaSearch className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex items-center">
              <div className="md:hidden flex items-center">
                {searchBarOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center ml-[-10px]">
                    <div className="relative w-48 sm:w-64">
                      <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white w-full"
                      />
                      <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none">
                        <FaSearch className="h-5 w-5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={closeSearchBar}
                      className="ml-1 text-gray-400 hover:text-white focus:outline-none"
                    >
                      <FaTimes className="h-5 w-5" />
                    </button>
                  </form>
                ) : (
                  <>
                    <button
                      onClick={toggleSearchBar}
                      className="text-gray-400 hover:text-white focus:outline-none"
                    >
                      <FaSearch className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      type="button"
                      className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white dark:text-white"
                      aria-controls="mobile-menu"
                      aria-expanded="false"
                    >
                      <span className="sr-only">Open main menu</span>
                      <FaBars className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`md:hidden absolute top-14 left-0 w-full bg-white dark:bg-gray-800 shadow-md ${menuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={handleInternshipSearch}
              className="text-gray-600 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium dark:text-white w-full text-left"
            >
              Internships
            </button>
            <a href="https://t.me/careerhub_job" className="text-gray-600 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium dark:text-white flex items-center">
              Job Alerts
              <FaTelegram className="ml-1 w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>

    </>
  );
};

export default NavBar;
