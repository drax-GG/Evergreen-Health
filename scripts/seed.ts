import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, limit, where } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const departments = [
  { name: 'Cardiology', description: 'Comprehensive heart care and diagnostics.', iconName: 'Heart' },
  { name: 'Neurology', description: 'Advanced treatment for brain and spine.', iconName: 'Activity' },
  { name: 'Pediatrics', description: 'Dedicated care for children and infants.', iconName: 'Users' },
  { name: 'Orthopedics', description: 'Bone and joint specialist care.', iconName: 'Bone' },
  { name: 'Dermatology', description: 'Skin, hair and nail treatments.', iconName: 'Sun' },
  { name: 'Gastroenterology', description: 'Digestive system and liver care.', iconName: 'Stomach' }
];

const doctors = [
  { name: 'Dr. Sarah Mitchell', specialty: 'Chief Cardiologist', bio: 'Over 15 years of experience in interventional cardiology.', availability: 'Mon - Fri', image: 'https://images.unsplash.com/photo-1559839734-2b71ca197ec2?auto=format&fit=crop&q=80&w=400', rating: 4.9, departmentId: 'Cardiology' },
  { name: 'Dr. James Wilson', specialty: 'Neurologist', bio: 'Expert in neurodegenerative diseases and brain mapping.', availability: 'Tue - Sat', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400', rating: 4.8, departmentId: 'Neurology' },
  { name: 'Dr. Elena Rodriguez', specialty: 'Pediatrician', bio: 'Passionate about child development and preventative care.', availability: 'Mon - Thu', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400', rating: 5.0, departmentId: 'Pediatrics' },
  { name: 'Dr. Michael Chen', specialty: 'Orthopedic Surgeon', bio: 'Specializing in sports injuries and joint replacements.', availability: 'Wed - Sun', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400', rating: 4.7, departmentId: 'Orthopedics' }
];

async function seed() {
  console.log('Seeding data...');
  
  // Check if departments already exist
  const deptSnap = await getDocs(query(collection(db, 'departments'), limit(1)));
  if (deptSnap.empty) {
    for (const dept of departments) {
      await addDoc(collection(db, 'departments'), dept);
      console.log(`Added department: ${dept.name}`);
    }
  }

  // Add admin user seed
  const adminEmail = 'admin@evergreenhealth.com';
  const adminSnap = await getDocs(query(collection(db, 'users'), where('email', '==', adminEmail)));
  if (adminSnap.empty) {
    await addDoc(collection(db, 'users'), {
      uid: 'admin_demo_id', // This should match auth UID, but for demo we just seed the doc
      name: 'System Admin',
      email: adminEmail,
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    console.log('Added admin user doc');
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
