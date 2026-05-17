import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Search, Star, Calendar, ArrowRight, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Doctors = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      const snap = await getDocs(collection(db, 'doctors'));
      setDoctors(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || doc.departmentId === selectedDept;
    return matchesSearch && matchesDept;
  });

  const uniqueDepts = ['All', ...new Set(doctors.map(d => d.departmentId))];

  if (loading) return <div className="h-screen flex items-center justify-center text-emerald-600 font-bold">Finding Specialists...</div>;

  return (
    <div className="py-20 bg-emerald-50/20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet Our <span className="text-emerald-600">Specialists</span></h1>
            <p className="text-gray-600 max-w-xl">World-class medical professionals committed to your health and recovery.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
              />
            </div>
            
            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 appearance-none w-full"
              >
                {uniqueDepts.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredDoctors.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[2rem] overflow-hidden shadow-lg shadow-emerald-900/5 group border border-emerald-50 hover:border-emerald-200 transition-all flex flex-col h-full"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={doc.image || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400'} 
                  alt={doc.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1 shadow-sm">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold text-gray-900">{doc.rating}</span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2">{doc.departmentId}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{doc.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{doc.specialty}</p>
                <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {doc.bio}
                </p>
                
                <div className="mt-auto space-y-3">
                  <div className="flex items-center text-xs text-gray-500 bg-emerald-50 p-2 rounded-lg">
                    <Calendar size={14} className="mr-2 text-emerald-600" />
                    <span>Available: {doc.availability}</span>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/booking', { state: { doctor: doc } })}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center group-hover:shadow-lg group-hover:shadow-emerald-200"
                  >
                    Book Now <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredDoctors.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-emerald-200">
            <p className="text-gray-500">No specialists found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
