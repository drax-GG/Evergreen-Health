import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, limit, where, deleteDoc, doc } from 'firebase/firestore';
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
  { name: 'Dr. Amit', specialty: 'Chief Cardiologist', bio: 'Expert in interventional cardiology with 15+ years of experience in top Indian hospitals.', availability: 'Mon - Fri', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400', rating: 4.9, departmentId: 'Cardiology' },
  { name: 'Dr. Vaishnavi', specialty: 'Neurologist', bio: 'Specializes in neuro-critical care and stroke management. Trained at premier medical institutes.', availability: 'Tue - Sat', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400', rating: 4.8, departmentId: 'Neurology' },
  { name: 'Dr. Gaurav', specialty: 'Pediatrician', bio: 'Dedicated to child wellness and development. Known for his friendly approach with young patients.', availability: 'Mon - Thu', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400', rating: 5.0, departmentId: 'Pediatrics' },
  { name: 'Dr. Varun', specialty: 'Orthopedic Surgeon', bio: 'Expert in robotic joint replacement and sports medicine surgery.', availability: 'Wed - Sun', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400', rating: 4.7, departmentId: 'Orthopedics' }
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

  // Clear existing doctors to avoid duplicates and re-seed
  const docSnap = await getDocs(collection(db, 'doctors'));
  for (const d of docSnap.docs) {
    await deleteDoc(doc(db, 'doctors', d.id));
  }
  console.log('Cleared old doctors.');

  for (const docData of doctors) {
    await addDoc(collection(db, 'doctors'), docData);
    console.log(`Added doctor: ${docData.name}`);
  }

  // Add admin user seed
  const adminEmail = 'admin@evergreenhealth.com';
  
  // Cleanup any incorrect admin docs (like @sahyadricare.com)
  const oldAdminSnap = await getDocs(query(collection(db, 'users'), where('email', '==', 'admin@sahyadricare.com')));
  for (const d of oldAdminSnap.docs) {
    await deleteDoc(doc(db, 'users', d.id));
    console.log('Deleted old admin doc: admin@sahyadricare.com');
  }

  const adminSnap = await getDocs(query(collection(db, 'users'), where('email', '==', adminEmail)));
  if (adminSnap.empty) {
    await addDoc(collection(db, 'users'), {
      uid: 'admin_demo_id',
      name: 'System Admin',
      email: adminEmail,
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    console.log('Added admin user doc: admin@evergreenhealth.com');
  } else {
    console.log('Admin user doc already exists: admin@evergreenhealth.com');
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
