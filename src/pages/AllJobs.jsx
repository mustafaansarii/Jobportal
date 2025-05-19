import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import config from '../config';
import ReactMarkdown from 'react-markdown';
import { FiExternalLink, FiBriefcase, FiImage } from "react-icons/fi";
import { Link } from 'react-router-dom';
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { supabase } from '../supabaseClient';

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleJobs, setVisibleJobs] = useState(10);
  const currentUrl = window.location.origin;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data) {
          setJobs(data);
          setFilteredJobs(data);
        } else {
          console.error('No data received from Supabase');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();

    // Set up real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setJobs(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setJobs(prev => prev.map(job => job.id === payload.new.id ? payload.new : job));
          } else if (payload.eventType === 'DELETE') {
            setJobs(prev => prev.filter(job => job.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredJobs(jobs);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = jobs.filter(job =>
      job.role.toLowerCase().includes(lowerCaseQuery) ||
      job.company.toLowerCase().includes(lowerCaseQuery) ||
      job.description.toLowerCase().includes(lowerCaseQuery) ||
      job.desc.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredJobs(filtered);
  };

  const getShareContent = (job) => {
    const jobUrl = `${currentUrl}/jobs/${job.id}`;
    return {
      jobUrl: jobUrl,
      applyUrl: job.applylink,
      title: `${job.role} at ${job.company}`,
      description: job.description || job.desc,
      hashtags: ['Jobs', 'Career', 'Hiring']
    };
  };

  const loadMoreJobs = () => {
    setVisibleJobs(prev => prev + 10);
  };

  if (loading) {
    return (
      <div>
        <NavBar onSearch={() => {}} />
        <div className="flex flex-col min-h-screen dark:text-white mt-10">
          <div className="container mx-auto px-4 py-8 flex-grow">
            <div className="flex flex-col items-center w-full max-w-full md:max-w-[800px] mx-auto">
              {Array(3).fill().map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden m-4 w-full">
                  <div className="p-6 flex items-start border">
                    <Skeleton circle={true} height={40} width={40} className="mr-4" />
                    <div>
                      <Skeleton height={28} width={250} className="mb-2" />
                      <Skeleton height={24} width={180} className="mb-3" />
                      <Skeleton height={80} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar onSearch={handleSearch} />
      <div className="flex flex-col min-h-screen dark:text-white mt-10">
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="flex flex-col items-center w-full max-w-full md:max-w-[800px] mx-auto">
            {filteredJobs.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">No jobs found.</div>
            ) : (
              <>
                {filteredJobs.slice(0, visibleJobs).map((job) => {
                  const shareContent = getShareContent(job);
                  const fullShareText = `${shareContent.title}\n\n${shareContent.description || ''}\n\nJob Details: ${shareContent.jobUrl}\nApply Here:`;
                  
                  return (
                    <div key={job.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden m-4 w-full border border-gray-100 dark:border-gray-700">
                      <div className="p-5 sm:p-7 flex flex-col sm:flex-row items-start">
                        <div className="w-full">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3">
                            <div className="flex items-start w-full sm:w-auto">
                              <div className="flex flex-row items-start">
                                {job.company_url && (
                                  <div className="mr-5 h-9 w-11 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                    <img
                                      src={`https://logo.clearbit.com/${new URL(job.company_url).hostname}`}
                                      alt="Company Logo"
                                      className="h-full w-full rounded-lg"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<FiBriefcase className="h-5 w-5 text-gray-500 dark:text-gray-400" />';
                                      }}
                                    />
                                  </div>
                                )}
                                <div className="flex flex-col w-full">
                                  <div className="flex sm:hidden flex-col w-full">
                                    <div className="flex justify-between items-center w-full">
                                      <div className="flex-1">
                                        <h2 className="text-xl font-bold  text-blue-600 transition-colors duration-200">
                                          {job.role}
                                        </h2>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <h3 className="text-gray-600 dark:text-gray-300 text-base font-medium">{job.company}</h3>
                                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                                        Posted on: {new Date(job.created_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="hidden sm:flex flex-col">
                                    <h2 className="text-xl sm:text-2xl font-bold text-blue-400 dark:hover:text-white transition-colors duration-200">
                                          {job.role}
                                        </h2>
                                    <div className="flex items-center space-x-2">
                                      <h3 className="text-gray-600 dark:text-gray-300 text-lg font-medium">{job.company}</h3>
                                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                                        Posted on: {new Date(job.created_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 md:mt-0">
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap">
                              {job.heading ? job.heading.split(',').map(item => (
                                <span key={item} className="bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full mr-2 text-sm mb-1">
                                  {item.trim()}
                                </span>
                              )) : ''}
                            </div>
                            </div>
                          <div className="text-gray-700 dark:text-gray-400 mt-3 prose max-h-[500px] overflow-hidden">
                            <ReactMarkdown
                              components={{
                                p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-6 mt-8" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-4 mt-6" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-4 mt-6" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-6" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-6" {...props} />,
                                li: ({ node, ...props }) => <li className="mb-2" {...props} />,
                                hr: ({ node, ...props }) => <hr className="my-8 border-gray-300 dark:border-gray-600" {...props} />,
                                a: ({ node, ...props }) => (
                                  <a 
                                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    {...props}
                                  />
                                ),
                                code: ({ node, ...props }) => (
                                  <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm" {...props} />
                                ),
                                pre: ({ node, ...props }) => (
                                  <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-auto text-sm my-4" {...props} />
                                ),
                                blockquote: ({ node, ...props }) => (
                                  <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4" {...props} />
                                ),
                                table: ({ node, ...props }) => (
                                  <div className="overflow-auto">
                                    <table className="min-w-full my-4" {...props} />
                                  </div>
                                ),
                                th: ({ node, ...props }) => (
                                  <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700" {...props} />
                                ),
                                td: ({ node, ...props }) => (
                                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600" {...props} />
                                ),
                              }}
                            >
                              {job.description && job.description.length > 500 ? job.description.slice(0, 400) + "..." : job.description || ''}
                            </ReactMarkdown>
                          </div>
                          <div className="mt-5 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-3">
                            <div className="flex flex-wrap justify-center">
                              <FacebookShareButton
                                url={shareContent.applyUrl}
                                quote={fullShareText}
                                className="mx-1 hover:opacity-75 transition-opacity duration-200"
                              >
                                <FacebookIcon size={28} className="sm:w-8 sm:h-8 w-7 h-7" round />
                              </FacebookShareButton>
                              <TwitterShareButton
                                url={shareContent.applyUrl}
                                title={fullShareText}
                                className="mx-1 hover:opacity-75 transition-opacity duration-200"
                              >
                                <TwitterIcon size={28} className="sm:w-8 sm:h-8 w-7 h-7" round />
                              </TwitterShareButton>
                              <LinkedinShareButton
                                url={shareContent.applyUrl}
                                title={shareContent.title}
                                summary={fullShareText}
                                source={config.Frontend_url}
                                className="mx-1 hover:opacity-75 transition-opacity duration-200"
                              >
                                <LinkedinIcon size={28} className="sm:w-8 sm:h-8 w-7 h-7" round />
                              </LinkedinShareButton>
                              <WhatsappShareButton
                                url={shareContent.applyUrl}
                                title={fullShareText}
                                className="mx-1 hover:opacity-75 transition-opacity duration-200"
                              >
                                <WhatsappIcon size={28} className="sm:w-8 sm:h-8 w-7 h-7" round />
                              </WhatsappShareButton>
                              <TelegramShareButton
                                url={shareContent.applyUrl}
                                title={fullShareText}
                                className="mx-1 hover:opacity-75 transition-opacity duration-200"
                              >
                                <TelegramIcon size={28} className="sm:w-8 sm:h-8 w-7 h-7" round />
                              </TelegramShareButton>
                              <EmailShareButton
                                url={shareContent.applyUrl}
                                subject={shareContent.title}
                                body={fullShareText}
                                className="mx-1 hover:opacity-75 transition-opacity duration-200"
                              >
                                <EmailIcon size={28} className="sm:w-8 sm:h-8 w-7 h-7" round />
                              </EmailShareButton>
                            </div>
                            <div className="flex flex-row sm:flex-row gap-3 w-full sm:w-auto justify-center sm:justify-start">
                              <Link
                                to={job.applylink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 sm:py-2.5 sm:px-5 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-200 text-sm sm:text-base text-center"
                              >
                                Apply Now <FiExternalLink className="inline-block ml-1" />
                              </Link>
                              <Link
                                to={`/jobs/${job.id}`}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 sm:py-2.5 sm:px-5 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-200 text-sm sm:text-base text-center"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {visibleJobs < filteredJobs.length && (
                  <button 
                    onClick={loadMoreJobs}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                  >
                    Show More
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AllJobs;
