import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Landing = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-white dark:bg-gray-100 flex items-center justify-center">
            <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 lg:py-16">
                {/* Left Content */}
                <div className="flex flex-col items-start justify-center mr-auto lg:col-span-7">
                    <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-indigo-600 sm:text-5xl md:text-6xl">
                        AI-Driven Interview Assistant
                    </h1>
                    <p className="mt-4 text-lg font-light text-gray-600 sm:text-xl">
                        Ace your interviews with cutting-edge AI tools that offer personalized preparation, mock interviews, and insightful feedback tailored just for you.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-4">
                        <button
                            onClick={() => navigate('/get-started')}
                            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300"
                        >
                            Get Started
                            <svg
                                className="w-5 h-5 ml-2 -mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300"
                        >
                            Signup
                        </button>
                        <button
                            onClick={() => navigate('/signin')}
                            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-indigo-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-4 focus:ring-indigo-300"
                        >
                            Signin
                        </button>
                    </div>
                </div>

                {/* Right Content */}
                <div className="relative hidden lg:col-span-5 lg:flex items-center justify-center">
                    <img
                        src="../ai_interview.png"
                        alt="AI Interview Assistant"
                        className="rounded-lg shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
};
