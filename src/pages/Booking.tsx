import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Calendar, Clock, User, Phone, Clipboard, CheckCircle2, ChevronRight } from 'lucide-react';
import { format, addDays, startOfDay } from 'date-fns';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(location.state?.doctor || null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const fetchDoctors = async () => {
      const snap = await getDocs(collection(db, 'doctors'));
      const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDoctors(docs);
      if (!selectedDoctor && docs.length > 0) {
        setSelectedDoctor(docs[0]);
      }
    };
    fetchDoctors();
  }, []);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error('Please fill in all details');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'appointments'), {
        patientId: user?.uid,
        patientName: userData?.name || user?.displayName || 'Patient',
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        status: 'pending',
        notes,
        createdAt: new Date().toISOString()
      });
      setStep(3);
      toast.success('Appointment booked successfully!');
    } catch (error: any) {
      toast.error('Error booking appointment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!selectedDoctor || !selectedDate || !selectedTime)) {
      toast.error('Please complete all selection');
      return;
    }
    setStep(step + 1);
  };

  // Generate next 7 days for selection
  const availableDates = Array.from({ length: 7 }, (_, i) => addDays(startOfDay(new Date()), i + 1));

  if (step === 3) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-emerald-50/20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-10 rounded-[3rem] text-center shadow-xl shadow-emerald-900/5 border border-emerald-50"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Awesome!</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your appointment with <span className="font-bold text-emerald-700">{selectedDoctor.name}</span> has been scheduled for <span className="font-bold">{format(selectedDate!, 'MMMM do')}</span> at <span className="font-bold">{selectedTime}</span>.
          </p>
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold transition-all hover:bg-emerald-700 shadow-lg shadow-emerald-200"
            >
              Go to Dashboard
            </button>
            <button 
              onClick={() => { setStep(1); setSelectedDate(null); setSelectedTime(''); }}
              className="w-full py-4 text-emerald-600 font-bold hover:underline"
            >
              Book Another Appointment
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-emerald-50/20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your <span className="text-emerald-600">Health Visit</span></h1>
              <p className="text-gray-600">Take the first step towards feeling better. Choose your preferred doctor and schedule.</p>
            </div>

            {/* Stepper indicator */}
            <div className="flex items-center space-x-4 mb-8">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'}`}>1</div>
              <div className={`h-1 w-12 rounded ${step >= 2 ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'}`}>2</div>
            </div>

            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {/* Doctor Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Choose Specialist</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {doctors.map(doc => (
                      <div 
                        key={doc.id}
                        onClick={() => setSelectedDoctor(doc)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center space-x-4 ${selectedDoctor?.id === doc.id ? 'border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-500/10' : 'border-gray-100 bg-white hover:border-emerald-200'}`}
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                          <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{doc.name}</p>
                          <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-tight">{doc.specialty}</p>
                        </div>
                        {selectedDoctor?.id === doc.id && <CheckCircle2 className="ml-auto text-emerald-600" size={20} />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Select Date</label>
                  <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                    {availableDates.map((date) => (
                      <div 
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`flex flex-col items-center justify-center min-w-[80px] h-24 rounded-2xl border-2 cursor-pointer transition-all shrink-0 ${selectedDate?.toDateString() === date.toDateString() ? 'border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'border-gray-100 bg-white hover:border-emerald-200'}`}
                      >
                        <span className="text-xs uppercase font-bold opacity-80">{format(date, 'EEE')}</span>
                        <span className="text-2xl font-bold">{format(date, 'd')}</span>
                        <span className="text-[10px] uppercase font-bold opacity-80">{format(date, 'MMM')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Available Slots</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${selectedTime === time ? 'border-emerald-500 bg-emerald-600 text-white' : 'border-gray-100 bg-white hover:text-emerald-600 hover:border-emerald-200'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={nextStep}
                    className="flex items-center text-emerald-600 font-bold group"
                  >
                    Continue to Details <ChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-[2.5rem] border border-emerald-100 space-y-6"
              >
                <div className="flex items-center space-x-3 text-emerald-600 mb-2">
                  <Clipboard size={20} />
                  <h2 className="text-xl font-bold">Additional Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Patient Details</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-emerald-50 p-4 rounded-xl">
                        <span className="block text-[10px] uppercase font-bold text-emerald-600 mb-1">Name</span>
                        <span className="font-bold text-gray-900">{userData?.name || user?.displayName}</span>
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-xl">
                        <span className="block text-[10px] uppercase font-bold text-emerald-600 mb-1">Email</span>
                        <span className="font-bold text-gray-900 text-sm truncate">{user?.email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Reason for Visit (Notes)</label>
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Symptoms, previous surgeries, or generic notes..."
                      className="w-full p-4 bg-emerald-50 border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 h-32 transition-all"
                    ></textarea>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
                  <button 
                    onClick={() => setStep(1)}
                    className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleBooking}
                    disabled={loading}
                    className="w-full flex-grow py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? 'Confirming...' : 'Confirm Appointment'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-100 shadow-xl shadow-emerald-900/5 sticky top-32">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Booking Summary</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Expert</p>
                    <p className="font-bold text-gray-900">{selectedDoctor?.name || 'Select Doctor'}</p>
                    <p className="text-sm text-emerald-600">{selectedDoctor?.specialty}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Date</p>
                    <p className="font-bold text-gray-900">{selectedDate ? format(selectedDate, 'EEEE, MMMM do') : 'Select Date'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Time</p>
                    <p className="font-bold text-gray-900">{selectedTime || 'Select Time'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-emerald-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-medium">Consultation Fee</span>
                  <span className="text-emerald-900 font-bold">$120.00</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-tight">
                  By confirming, you agree to our terms of service and cancellation policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
