import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Activity, Users, Calendar, Award, Shield, Heart, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/images/hospital_hero_bg_1779024445034.png';

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Hospital Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/95 via-emerald-950/70 to-emerald-900/30"></div>
          
          {/* Accent lighting */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-400/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-8 border border-emerald-500/20 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Evergreen Health Excellence</span>
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl md:text-8xl font-bold text-white mb-8 leading-[0.95] tracking-tight"
            >
              World Class <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200 uppercase text-5xl md:text-7xl block mt-4">Care for Everyone</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-emerald-50/70 mb-10 leading-relaxed font-light max-w-xl"
            >
              Experience a new standard of healthcare with advanced technology and compassionate medical experts.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Link to="/booking" className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-emerald-500/20 flex items-center justify-center text-lg">
                Book Appointment <ArrowRight className="ml-2 w-6 h-6" />
              </Link>
              <Link to="/doctors" className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md rounded-2xl font-bold transition-all text-center text-lg">
                Meet Our Experts
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Happy Patients', value: '50k+', icon: Users },
              { label: 'Expert Doctors', value: '120+', icon: Award },
              { label: 'Certifications', value: '15+', icon: Shield },
              { label: 'Years Experience', value: '25+', icon: Clock },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl hover:bg-emerald-50 transition-colors group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <stat.icon size={24} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialities Preview */}
      <section className="py-20 bg-emerald-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Medical Specialties</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer comprehensive medical services with experts in every field of healthcare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Cardiology', desc: 'Expert care for your heart with advanced diagnostics.', icon: Heart, color: 'bg-red-100 text-red-600' },
              { title: 'Neurology', desc: 'Specialized treatment for brain and nervous system disorders.', icon: Activity, color: 'bg-blue-100 text-blue-600' },
              { title: 'Pediatrics', desc: 'Gentle and loving healthcare for your little ones.', icon: Users, color: 'bg-orange-100 text-orange-600' },
            ].map((dept, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 group"
              >
                <div className={`w-14 h-14 rounded-2xl ${dept.color} flex items-center justify-center mb-6`}>
                  <dept.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{dept.title}</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{dept.desc}</p>
                <Link to="/departments" className="inline-flex items-center text-emerald-600 font-semibold text-sm hover:underline">
                  Learn More <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/departments" className="inline-flex items-center px-6 py-3 border-2 border-emerald-600 text-emerald-600 font-bold rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
              View All Departments
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-600"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-emerald-500 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"></div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Need Immediate Attention?</h2>
            <p className="text-lg text-emerald-100 mb-10 max-w-2xl mx-auto">
              Our specialists are ready to provide you with the best care. Schedule your appointment today and take the first step towards recovery.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/booking" className="px-10 py-5 bg-white text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-lg text-lg">
                Book An Appointment
              </Link>
              <div className="flex flex-col text-left">
                <span className="text-emerald-100 text-sm font-medium">Emergency Contact</span>
                <span className="text-white text-2xl font-bold">9999999999</span>
              </div>
            </div>
            
            <div className="mt-12 text-emerald-100/60 text-sm">
              <p>📍 Gaurakshan Road, Akola, Maharashtra 444001</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
