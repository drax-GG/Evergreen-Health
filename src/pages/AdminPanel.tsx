import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, getCountFromServer } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Users, UserCog, Calendar, Activity, 
  CheckCircle2, XCircle, Search, Filter,
  ArrowUpRight, Clock, ShieldAlert, MoreVertical, Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'doctors' | 'patients'>('appointments');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [stats, setStats] = useState({ appointments: 0, doctors: 0, patients: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for all appointments
    const qAppts = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
    const unsubAppts = onSnapshot(qAppts, (snap) => {
      setAppointments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listen for all doctors
    const qDocs = query(collection(db, 'doctors'));
    const unsubDocs = onSnapshot(qDocs, (snap) => {
      setDoctors(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listen for all patients (users with role 'patient')
    const qPatients = query(collection(db, 'users'));
    const unsubPatients = onSnapshot(qPatients, (snap) => {
      const allUsers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPatients(allUsers.filter((u: any) => u.role === 'patient'));
      setLoading(false);
    });

    return () => {
      unsubAppts();
      unsubDocs();
      unsubPatients();
    };
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status });
      toast.success(`Appointment marked as ${status}`);
    } catch (error: any) {
      toast.error('Error: ' + error.message);
    }
  };

  const deleteDoctor = async (id: string) => {
    if (window.confirm('Remove this doctor from system?')) {
      await deleteDoc(doc(db, 'doctors', id));
      toast.success('Doctor removed');
    }
  };

  const statsCards = [
    { label: 'Appointments', value: appointments.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Specialists', value: doctors.length, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Patients', value: patients.length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  if (loading) return <div className="h-screen flex items-center justify-center text-emerald-900 font-bold">Accessing Secure Admin Core...</div>;

  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <ShieldAlert size={20} />
            </div>
            <span className="text-red-600 font-bold text-xs uppercase tracking-widest">Administrator Access</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Hospital <span className="text-emerald-600">Oversight</span></h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {statsCards.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={28} />
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-4xl font-black text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Management Area */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-8">
            {[
              { id: 'appointments', label: 'Bookings', icon: Calendar },
              { id: 'doctors', label: 'Specialists', icon: Activity },
              { id: 'patients', label: 'Patient Registry', icon: Users },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-8 px-6 flex items-center space-x-3 border-b-4 transition-all ${
                  activeTab === tab.id 
                    ? 'border-emerald-600 text-emerald-600 font-bold' 
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <tab.icon size={20} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center">
                  Export Data <ArrowUpRight size={18} className="ml-2" />
                </button>
              </div>
            </div>

            {/* Content Table/List */}
            <div className="overflow-x-auto">
              {activeTab === 'appointments' && (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="pb-6 px-4 whitespace-nowrap">Patient</th>
                      <th className="pb-6 px-4 whitespace-nowrap">Doctor</th>
                      <th className="pb-6 px-4 whitespace-nowrap">Schedule</th>
                      <th className="pb-6 px-4 whitespace-nowrap">Status</th>
                      <th className="pb-6 px-4 text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {appointments.map((appt) => (
                      <tr key={appt.id} className="group hover:bg-emerald-50/30 transition-colors">
                        <td className="py-6 px-4">
                          <p className="font-bold text-gray-900">{appt.patientName}</p>
                          <p className="text-[10px] text-gray-400">{appt.patientId}</p>
                        </td>
                        <td className="py-6 px-4">
                          <p className="font-bold text-emerald-900">{appt.doctorName}</p>
                          <p className="text-[10px] text-emerald-600 font-bold uppercase">{appt.specialty}</p>
                        </td>
                        <td className="py-6 px-4">
                          <p className="font-bold text-gray-900">{format(new Date(appt.date), 'MMM dd, yyyy')}</p>
                          <p className="text-[10px] text-gray-400">{appt.time}</p>
                        </td>
                        <td className="py-6 px-4">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                            appt.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {appt.status}
                          </span>
                        </td>
                        <td className="py-6 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {appt.status === 'pending' && (
                              <button onClick={() => updateStatus(appt.id, 'confirmed')} className="p-2 text-emerald-400 hover:text-emerald-700 transition-colors">
                                <CheckCircle2 size={20} />
                              </button>
                            )}
                            <button onClick={() => updateStatus(appt.id, 'cancelled')} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                              <XCircle size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'doctors' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctors.map(doc => (
                    <div key={doc.id} className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 relative group">
                      <button 
                        onClick={() => deleteDoctor(doc.id)}
                        className="absolute top-4 right-4 p-2 bg-white rounded-xl text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="flex items-center space-x-4 mb-4">
                        <img src={doc.image} className="w-16 h-16 rounded-2xl object-cover" />
                        <div>
                          <h4 className="font-bold text-gray-900">{doc.name}</h4>
                          <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider">{doc.specialty}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock size={12} className="mr-1" /> Available: {doc.availability}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'patients' && (
                <div className="space-y-4">
                  {patients.map(patient => (
                    <div key={patient.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-gray-400 font-bold">
                          {patient.name?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{patient.name}</h4>
                          <p className="text-gray-400 text-xs">{patient.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Joined</p>
                        <p className="text-sm font-bold text-gray-900">{format(new Date(patient.createdAt), 'MMM yyyy')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
