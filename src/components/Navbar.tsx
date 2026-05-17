import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, HeartPulse, User, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, userData, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Departments', path: '/departments' },
    { name: 'Doctors', path: '/doctors' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <HeartPulse className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-emerald-900 tracking-tight">Evergreen<span className="text-emerald-600">Health</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-emerald-600 ${location.pathname === link.path ? 'text-emerald-600' : 'text-gray-600'}`}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600">
                  <LayoutDashboard size={18} />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 hover:bg-emerald-100 transition-colors">
                    <ShieldCheck size={18} />
                    <span className="text-sm font-medium">Admin</span>
                  </Link>
                )}
                <button 
                  onClick={() => signOut(auth)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-emerald-600">Login</Link>
                <Link to="/signup" className="bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-3 text-base font-medium text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                    >
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-3 text-base font-medium text-emerald-700 hover:bg-emerald-50 rounded-lg"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut(auth);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-3 text-base font-medium text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="block mx-3 py-3 text-center bg-emerald-600 text-white rounded-lg font-medium"
                    >
                      Join Now
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
