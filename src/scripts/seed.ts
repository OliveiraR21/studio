import 'dotenv/config';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, CollectionReference } from 'firebase-admin/firestore';
import { learningModules as mockModules, users as mockUsers } from '../lib/mock-data';
import type { Course, Track, Module } from '@/lib/types';

async function seedDatabase() {
  console.log('--- Starting Database Seed ---');

  // Initialize Firebase Admin SDK
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable not set. Please check your .env file.');
  }

  try {
    initializeApp({
      credential: cert(JSON.parse(serviceAccountKey)),
    });
  } catch (error: any) {
    if (error.code !== 'app/duplicate-app') {
      throw error;
    }
    console.log('Firebase app already initialized.');
  }

  const db = getFirestore();

  // Clear existing collections
  console.log('Clearing existing data...');
  await clearCollection('courses', db);
  await clearCollection('tracks', db);
  await clearCollection('modules', db);
  await clearCollection('users', db);
  console.log('Existing data cleared.');

  // Seed Users
  console.log('Seeding users...');
  const usersCollection = db.collection('users');
  for (let i = 0; i < mockUsers.length; i++) {
    // Manually set ID to '1', '2', etc. for predictability
    const userId = (i + 1).toString();
    await usersCollection.doc(userId).set(mockUsers[i]);
  }
  console.log(`${mockUsers.length} users seeded.`);

  // Seed Modules, Tracks, and Courses
  console.log('Seeding modules, tracks, and courses...');
  const modulesCollection = db.collection('modules');
  const tracksCollection = db.collection('tracks');
  const coursesCollection = db.collection('courses');
  
  let courseCounter = 0;

  for (const moduleData of mockModules) {
    const { tracks, ...moduleInfo } = moduleData;
    const moduleRef = await modulesCollection.add(moduleInfo);
    console.log(`  Created module: ${moduleInfo.title} (ID: ${moduleRef.id})`);

    for (const trackData of tracks) {
      const { courses, ...trackInfo } = trackData;
      const trackRef = await tracksCollection.add({
        ...trackInfo,
        moduleId: moduleRef.id,
      });
      console.log(`    Created track: ${trackInfo.title} (ID: ${trackRef.id})`);
      
      for (const courseData of courses) {
        courseCounter++;
        await coursesCollection.add({
          ...courseData,
          moduleId: moduleRef.id,
          trackId: trackRef.id,
        });
      }
      console.log(`      Added ${courses.length} courses to track.`);
    }
  }
  console.log(`${mockModules.length} modules and their content seeded.`);
  console.log(`Total courses seeded: ${courseCounter}`);

  console.log('--- Database Seed Finished Successfully ---');
}

async function clearCollection(collectionPath: string, db: FirebaseFirestore.Firestore) {
    const collectionRef = db.collection(collectionPath) as CollectionReference;
    const batchSize = 100;

    const query = collectionRef.orderBy('__name__').limit(batchSize);
    let snapshot;

    while (true) {
        snapshot = await query.get();
        if (snapshot.size === 0) {
            return;
        }

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        process.stdout.write('.');
    }
}


seedDatabase().catch(error => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
