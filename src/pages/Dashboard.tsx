import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, where, getDocs, onSnapshot, orderBy, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, FileText, Upload, Trash2, User, ChevronRight, Activity, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, userData } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [reportTitle, setReportTitle] = useState('');

  useEffect(() => {
    if (!user) return;

    // Listen for appointments
    const qAppts = query(
      collection(db, 'appointments'),
      where('patientId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribeAppts = onSnapshot(qAppts, (snap) => {
      setAppointments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error('Appointments snapshot error:', error);
      toast.error('Failed to load appointments: ' + error.message);
    });

    // Listen for reports
    const qReports = query(
      collection(db, 'reports'),
      where('patientId', '==', user.uid),
      orderBy('uploadedAt', 'desc')
    );
    
    const unsubscribeReports = onSnapshot(qReports, (snap) => {
      setReports(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error('Reports snapshot error:', error);
      toast.error('Failed to load reports: ' + error.message);
      setLoading(false);
    });

    return () => {
      unsubscribeAppts();
      unsubscribeReports();
    };
  }, [user]);

  const handleUploadReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle) return;
    setIsUploading(true);
    try {
      // In a real app, we would upload to Firebase Storage
      // Here we simulate with a placeholder URL
      await addDoc(collection(db, 'reports'), {
        patientId: user?.uid,
        title: reportTitle,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedAt: new Date().toISOString()
      });
      setReportTitle('');
      toast.success('Report added successfully!');
    } catch (error: any) {
      toast.error('Error adding report: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const cancelAppointment = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await deleteDoc(doc(db, 'appointments', id));
        toast.success('Appointment cancelled');
      } catch (error: any) {
        toast.error('Error: ' + error.message);
      }
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-emerald-600 font-bold italic">Gathering your health data...</div>;

  return (
    <div className="py-12 bg-emerald-50/20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 space-y-6 md:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-[2rem] bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <User size={40} />
            </div>
            <div>
              <p className="text-emerald-600 font-bold uppercase tracking-wider text-xs mb-1">Patient Portal</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Welcome, {userData?.name || 'User'}</h1>
              <p className="text-gray-500 text-sm">You have {appointments.length} scheduled visits.</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button className="p-3 bg-white border border-emerald-100 rounded-2xl text-gray-400 hover:text-emerald-600 transition-colors relative">
              <Bell size={24} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
              <Activity size={20} />
              <span>Health Pulse</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column - Appointments */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Calendar className="mr-3 text-emerald-600" /> Upcoming Visits
                </h2>
              </div>
              
              <div className="space-y-4">
                {appointments.length > 0 ? appointments.map((appt, i) => (
                  <motion.div 
                    key={appt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        {format(new Date(appt.date), 'dd')}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{appt.doctorName}</h3>
                        <p className="text-emerald-600 text-xs font-bold uppercase">{appt.specialty}</p>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <Clock size={12} className="mr-1" /> {appt.time} • {format(new Date(appt.date), 'MMMM do, yyyy')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {appt.status}
                      </span>
                      <button 
                        onClick={() => cancelAppointment(appt.id)}
                        className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                        title="Cancel Appointment"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                )) : (
                  <div className="bg-white/50 border-2 border-dashed border-emerald-200 rounded-[2rem] p-12 text-center">
                    <p className="text-gray-500 mb-4">No upcoming appointments scheduled.</p>
                    <button className="text-emerald-600 font-bold inline-flex items-center hover:underline">
                      Book your first visit <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Side Column - Reports & Upload */}
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-[2.5rem] border border-emerald-100 shadow-xl shadow-emerald-900/5">
              <h2 className="text-xl font-bold text-gray-900 flex items-center mb-6">
                <FileText className="mr-3 text-emerald-600" /> Medical Reports
              </h2>
              
              {/* Upload Form */}
              <form onSubmit={handleUploadReport} className="mb-8">
                <div className="relative mb-3">
                  <input 
                    type="text" 
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="Report title..."
                    className="w-full px-4 py-3 bg-emerald-50 rounded-xl text-sm border border-emerald-100 focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isUploading || !reportTitle}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center justify-center hover:bg-emerald-700 transition-all disabled:opacity-50"
                >
                  <Upload size={16} className="mr-2" /> {isUploading ? 'Adding...' : 'Add Report'}
                </button>
              </form>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {reports.length > 0 ? reports.map((report) => (
                  <div key={report.id} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-50 flex items-center justify-between group hover:bg-emerald-100/50 transition-all">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-gray-800 text-sm truncate">{report.title}</p>
                        <p className="text-[10px] text-gray-400">{format(new Date(report.uploadedAt), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <a 
                      href={report.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-400 group-hover:text-emerald-700 transition-colors"
                    >
                      <ChevronRight size={20} />
                    </a>
                  </div>
                )) : (
                  <p className="text-center text-sm text-gray-400 py-6">No reports uploaded yet.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
