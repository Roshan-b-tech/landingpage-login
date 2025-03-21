import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ChevronLeft, ChevronRight } from 'lucide-react';

const routes = ['/', '/login', '/signup', '/profile'];

const getPageNumber = (pathname: string) => {
    const index = routes.indexOf(pathname);
    return Math.max(index + 1, 1); // Ensure it's at least 1
};

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPage = getPageNumber(location.pathname);
    const totalPages = routes.length;

    const handlePrevious = () => {
        const currentIndex = routes.indexOf(location.pathname);
        if (currentIndex > 0) {
            navigate(routes[currentIndex - 1]);
        }
    };

    const handleNext = () => {
        const currentIndex = routes.indexOf(location.pathname);
        if (currentIndex < routes.length - 1) {
            navigate(routes[currentIndex + 1]);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-50">
            <div className="max-w-md mx-auto flex justify-center items-center p-4 gap-6">
                <button
                    onClick={() => navigate('/')}
                    className={`text-gray-500 hover:text-gray-700 transition-colors ${location.pathname === '/' ? 'text-purple-600' : ''}`}
                >
                    <Home
                        size={24}
                        strokeWidth={1}
                        className={location.pathname === '/' ? 'fill-current' : ''}
                    />
                </button>

                <div className="flex items-center gap-3 text-gray-500">
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className={`hover:text-gray-700 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <ChevronLeft size={20} strokeWidth={1.5} />
                    </button>
                    <span className="text-sm font-medium">{currentPage} of {totalPages}</span>
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`hover:text-gray-700 transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <ChevronRight size={20} strokeWidth={1.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Footer; 