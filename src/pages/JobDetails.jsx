import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import config from '../config';
import { IoIosArrowForward } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { FiExternalLink, FiBriefcase } from "react-icons/fi";
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
import { Helmet } from 'react-helmet';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUrl = window.location.href;

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data) {
          setJob(data);
        } else {
          console.error('No data received from Supabase');
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const getShareContent = () => {
    const jobUrl = currentUrl;
    return {
      jobUrl: jobUrl,
      applyUrl: job.applylink,
      title: `${job.role} at ${job.company}`,
      description: job.description || job.desc,
      hashtags: ['Jobs', 'Career', 'Hiring']
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen dark:text-white">
        <NavBar />
        <div className="container mx-auto px-4 py-8 flex-grow mt-10">
          <div className="max-w-[1000px] mx-auto -mt-4">
            <nav className="text-gray-500 dark:text-gray-300" aria-label="Breadcrumb">
              <ol className="list-none p-0 inline-flex">
                <li className="flex items-center">
                  <Skeleton width={50} height={20} />
                  <IoIosArrowForward className="fill-current w-3 h-3 mx-3" />
                </li>
                <li className="flex items-center">
                  <Skeleton width={80} height={20} />
                </li>
              </ol>
            </nav>
          </div>

          <div className="flex justify-center">
            <div className="dark:bg-gray-800 shadow-md rounded-lg overflow-hidden w-full max-w-[1000px] mt-4 border">
              <div className="p-6 flex items-start">
                <Skeleton circle={true} height={40} width={40} className="mr-4" />
                <div>
                  <Skeleton height={30} width={200} />
                  <Skeleton height={20} width={150} className="mb-4" />
                  <Skeleton count={5} height={20} className="mb-2" />
                  <Skeleton width={100} height={40} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-gray-800 dark:text-white">
        Job not found
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen dark:text-white">
      <Helmet>
        <title>{job ? `${job.role} at ${job.company} | Job Portal` : 'Job Details | Job Portal'}</title>
        <meta name="description" content={job.desc} />
        <meta property="og:title" content={`${job.role} at ${job.company}`} />
        <meta property="og:description" content={job.desc} />
        <meta property="og:url" content={currentUrl} />
        {/* You can add more meta tags as needed, e.g., for Twitter */}
      </Helmet>
      <NavBar />
      <div className="container mx-auto px-4 py-8 flex-grow mt-12">
        <div className="max-w-[1000px] mx-auto -mt-1 px-2">
          {/* Breadcrumb Navigation */}
          <nav className="text-gray-500 dark:text-gray-300" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link to="/" className="hover:text-blue-500 dark:hover:text-blue-400 flex items-center">
                  <FaHome className="mr-2" />
                  <span>Home</span>
                </Link>
                <IoIosArrowForward className="fill-current w-3 h-3 mx-3" />
              </li>
              <li className="flex items-center">
                <span className="text-gray-700 dark:text-gray-300" aria-current="page">jobs</span>
              </li>
            </ol>
          </nav>
        </div>
        <div className="flex justify-center px-2">
          <div className="dark:bg-gray-800 shadow-md rounded-lg overflow-hidden w-full max-w-[1000px] mt-4 border border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col">
                {/* Company Info and Apply Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                  <div className="flex items-center mb-2 sm:mb-0">
                    {job.company_url && (
                      <a href={job.company_url} target="_blank" rel="noopener noreferrer">
                        <div className="h-12 w-12 rounded mr-4 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                          <img
                            src={`https://logo.clearbit.com/${new URL(job.company_url).hostname}`}
                            alt="Company Logo"
                            className="h-full w-full rounded object-contain hover:opacity-75 transition-opacity duration-200"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<FiBriefcase className="h-6 w-6 text-gray-500 dark:text-gray-400" />';
                            }}
                          />
                        </div>
                      </a>
                    )}
                    <div>
                      <h2 className="text-xl font-semibold  text-blue-600 dark:text-white">{job.role}</h2>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-x-2 mt-1">
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">{job.company}</h3>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          Posted on: {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                          {job.heading
                            ? job.heading
                                .split(',')
                                .map((item, index) => (
                                  <span
                                    key={index}
                                    className="bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full mr-2 inline-block text-gray-600 dark:text-gray-300"
                                  >
                                    {item.trim()}
                                  </span>
                                ))
                            : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                  <a
                    href={job.applylink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-300 block w-full sm:w-auto text-center shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Apply Now <FiExternalLink className="inline-block ml-1" />
                  </a>
                </div>

                <div className="mt-4 sm:mt-2">
                  <div className="block sm:hidden">
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-y-2">
                      {job.heading
                        ? job.heading
                            .split(',')
                            .map((item, index) => (
                              <span key={index} className="bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full mr-2 inline-block text-gray-600 dark:text-gray-300">
                                {item.trim()}
                              </span>
                            ))
                        : ''}
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className="prose dark:prose-invert text-left text-gray-700 dark:text-gray-300 max-w-full">
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => <p className="mb-4 text-gray-700 dark:text-gray-300" {...props} />,
                      h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-6 mt-8 text-gray-800 dark:text-white" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-4 mt-6 text-gray-800 dark:text-white" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-4 mt-6 text-gray-800 dark:text-white" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-6 text-gray-700 dark:text-gray-300" {...props} />,
                      li: ({ node, ...props }) => <li className="mb-2 text-gray-700 dark:text-gray-300" {...props} />,
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
                    {job.description}
                  </ReactMarkdown>
                </div>

                {/* Share Buttons */}
                <div className="mt-6 flex justify-center">
                  {job && (
                    <>
                      <FacebookShareButton
                        url={getShareContent().jobUrl}
                        quote={`${getShareContent().title}\n\n${getShareContent().description}\n\nApply Here: ${getShareContent().applyUrl} Job Details:`}
                        className="mx-1 hover:opacity-75 transition-opacity duration-200"
                      >
                        <FacebookIcon size={28} className="sm:w-8 sm:h-8 w-7 h-7" round />
                      </FacebookShareButton>
                      <TwitterShareButton
                        url={getShareContent().jobUrl}
                        title={`${getShareContent().title}\n\n${getShareContent().description}\n\nApply Here: ${getShareContent().applyUrl} Job Details:`}
                        className="mx-1 hover:opacity-75 transition-opacity duration-200"
                      >
                        <TwitterIcon size={28} className="sm:w-8 sm:h-8 w-7 h-7" round />
                      </TwitterShareButton>
                      <LinkedinShareButton
                        url={getShareContent().jobUrl}
                        title={getShareContent().title}
                        summary={`${getShareContent().description}\n\nApply Here: ${getShareContent().applyUrl} Job Details:`}
                        source={config.Frontend_url}
                        className="mx-1 hover:opacity-75 transition-opacity duration-200"
                      >
                        <LinkedinIcon size={28} className="sm:w-8 sm:h-8 w-7 h-7" round />
                      </LinkedinShareButton>
                      <WhatsappShareButton
                        url={getShareContent().jobUrl}
                        title={`${getShareContent().title}\n\n${getShareContent().description}\n\nApply Here: ${getShareContent().applyUrl} Job Details:`}
                        className="mx-1 hover:opacity-75 transition-opacity duration-200"
                      >
                        <WhatsappIcon size={28} className="sm:w-8 sm:h-8 w-7 h-7" round />
                      </WhatsappShareButton>
                      <TelegramShareButton
                        url={getShareContent().jobUrl}
                        title={`${getShareContent().title}\n\n${getShareContent().description}\n\nApply Here: ${getShareContent().applyUrl} Job Details:`}
                        className="mx-1 hover:opacity-75 transition-opacity duration-200"
                      >
                        <TelegramIcon size={28} className="sm:w-8 sm:h-8 w-7 h-7" round />
                      </TelegramShareButton>
                      <EmailShareButton
                        url={getShareContent().jobUrl}
                        subject={getShareContent().title}
                        body={`${getShareContent().description}\n\nApply Here: ${getShareContent().applyUrl} Job Details:`}
                        className="mx-1 hover:opacity-75 transition-opacity duration-200"
                      >
                        <EmailIcon size={28} className="sm:w-8 sm:h-8 w-7 h-7" round />
                      </EmailShareButton>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobDetails;
