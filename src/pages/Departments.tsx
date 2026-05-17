import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Heart, Activity, Users, Bone, Sun, ClipboardCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap: Record<string, any> = {
  Heart, Activity, Users, Bone, Sun, ClipboardCheck
};

const Departments = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepts = async () => {
      const snap = await getDocs(collection(db, 'departments'));
      setDepartments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchDepts();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-emerald-600">Loading Departments...</div>;

  return (
    <div className="py-20 bg-emerald-50/20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Medical <span className="text-emerald-600">Departments</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto text-lg"
          >
            Explore our specialized divisions, each equipped with world-class facilities and expert physicians.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {departments.map((dept, i) => {
            const Icon = iconMap[dept.iconName] || Activity;
            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-emerald-50 group hover:border-emerald-200 transition-all"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <Icon size={32} />
                  </div>
                  <span className="text-emerald-100 font-black text-4xl opacity-20 group-hover:opacity-100 group-hover:text-emerald-500/10 transition-all">0{i + 1}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{dept.name}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {dept.description}
                </p>
                <Link to="/doctors" className="inline-flex items-center space-x-2 text-emerald-600 font-bold group/link">
                  <span>Find a Specialist</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Departments;
