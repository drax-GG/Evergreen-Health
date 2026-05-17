import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-emerald-950 text-emerald-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <HeartPulse className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Evergreen Health</span>
            </Link>
            <p className="text-emerald-200/70 text-sm leading-relaxed">
              Serving the Akola community with excellence in healthcare. Evergreen Health is dedicated to providing compassionate medical services with advanced technology.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="bg-emerald-900 p-2 rounded-full hover:bg-emerald-800 transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Departments', 'Doctors', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-emerald-200/70 hover:text-white transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">Departments</h3>
            <ul className="space-y-3">
              {['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology'].map((item) => (
                <li key={item} className="text-emerald-200/70 hover:text-white transition-colors text-sm cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm">
                <MapPin className="text-emerald-500 shrink-0 mt-1" size={18} />
                <span className="text-emerald-200/70">Gaurakshan Road, Akola, Maharashtra 444001</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Phone className="text-emerald-500 shrink-0" size={18} />
                <span className="text-emerald-200/70">9999999999</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Mail className="text-emerald-500 shrink-0" size={18} />
                <span className="text-emerald-200/70">support@evergreenhealth.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-emerald-900 text-center">
          <p className="text-emerald-200/40 text-xs">
            © {new Date().getFullYear()} Evergreen Health. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
