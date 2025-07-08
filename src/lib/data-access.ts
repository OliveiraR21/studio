
import type { User, Module, Track, Course, UserRole } from './types';
import { db } from './firebase'; // Import the initialized Firestore instance
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  limit,
} from 'firebase/firestore';

// --- Data Fetching Functions ---

// Fetch all learning modules and their nested tracks/courses
export async function getLearningModules(): Promise<Module[]> {
  const modulesSnapshot = await getDocs(collection(db, 'modules'));
  const tracksSnapshot = await getDocs(collection(db, 'tracks'));
  const coursesSnapshot = await getDocs(collection(db, 'courses'));

  const coursesByTrackId = new Map<string, Course[]>();
  coursesSnapshot.forEach(doc => {
    const course = { id: doc.id, ...doc.data() } as Course;
    const trackId = course.trackId;
    if (!coursesByTrackId.has(trackId)) {
        coursesByTrackId.set(trackId, []);
    }
    coursesByTrackId.get(trackId)!.push(course);
  });

  const tracksByModuleId = new Map<string, Track[]>();
  tracksSnapshot.forEach(doc => {
    const track = { id: doc.id, ...doc.data() } as Track;
    track.courses = coursesByTrackId.get(track.id) || [];
    const moduleId = track.moduleId;
     if (!tracksByModuleId.has(moduleId)) {
        tracksByModuleId.set(moduleId, []);
    }
    tracksByModuleId.get(moduleId)!.push(track);
  });

  const modules: Module[] = [];
  modulesSnapshot.forEach(doc => {
    const module = { id: doc.id, ...doc.data() } as Module;
    module.tracks = tracksByModuleId.get(module.id) || [];
    modules.push(module);
  });

  // This sorting is to maintain consistency with how mock data was ordered.
  const moduleOrder = ['module-integration', 'module-hs', 'module-ss', 'module-hms'];
  modules.sort((a, b) => moduleOrder.indexOf(a.id) - moduleOrder.indexOf(b.id));

  return modules;
}

// Fetch all users
export async function getUsers(): Promise<User[]> {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

// Fetch a single user by ID
export async function getUserById(userId: string): Promise<User | null> {
    if (!userId) return null;
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? ({ id: userDoc.id, ...userDoc.data() } as User) : null;
}

// Fetch a single user by Email
export async function findUserByEmail(email: string): Promise<User | null> {
    const q = query(collection(db, "users"), where("email", "==", email.toLowerCase()), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return null;
    }
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User;
}


// Find a course by its ID, and include its parent module and track.
export async function findCourseById(courseId: string): Promise<{ course: Course, track: Track, module: Module } | null> {
    if (!courseId) return null;
    const courseDoc = await getDoc(doc(db, 'courses', courseId));
    if (!courseDoc.exists()) return null;

    const course = { id: courseDoc.id, ...courseDoc.data() } as Course;

    const trackDoc = await getDoc(doc(db, 'tracks', course.trackId));
    if (!trackDoc.exists()) return null;

    const track = { id: trackDoc.id, ...trackDoc.data() } as Track;

    const moduleDoc = await getDoc(doc(db, 'modules', course.moduleId));
    if (!moduleDoc.exists()) return null;

    const module = { id: moduleDoc.id, ...moduleDoc.data() } as Module;

    return { course, track, module };
}


// Find a course and its parent track by the course ID
export async function findCourseByIdWithTrack(courseId: string): Promise<{ course: Course, track: Track } | null> {
    if (!courseId) return null;
    const courseDoc = await getDoc(doc(db, 'courses', courseId));
    if (!courseDoc.exists()) return null;

    const courseData = courseDoc.data();
    const course = { id: courseDoc.id, ...courseData } as Course;

    const trackDoc = await getDoc(doc(db, 'tracks', course.trackId));
    if (!trackDoc.exists()) {
        throw new Error(`Data integrity issue: Track with ID ${course.trackId} not found for course ${courseId}`);
    }

    const track = { id: trackDoc.id, ...trackDoc.data() } as Track;

    // We need to fetch the courses for the track to maintain the type structure expected by components
    const coursesSnapshot = await getDocs(query(collection(db, 'courses'), where('trackId', '==', track.id)));
    track.courses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));

    return { course, track };
}

// Finds the very first course that is not marked as completed for a given user.
export async function findNextCourseForUser(user: User): Promise<Course | null> {
    // This is inefficient and should be optimized in a real production app
    // (e.g., by adding an 'order' field to courses).
    // For now, it mirrors the logic of the mock data implementation.
    const allModules = await getLearningModules();
    for (const module of allModules) {
        for (const track of module.tracks) {
            for (const course of track.courses) {
                if (!user.completedCourses.includes(course.id)) {
                    return course;
                }
            }
        }
    }
    return null; // All courses completed
}

// --- Mutation Functions ---

// Creates a course in Firestore.
export async function createCourse(courseData: { trackId: string; title: string; description: string; videoUrl: string; thumbnailUrl?: string; durationInSeconds?: number; }): Promise<Course> {
    const trackDoc = await getDoc(doc(db, 'tracks', courseData.trackId));
    if (!trackDoc.exists()) {
         throw new Error(`Track with ID ${courseData.trackId} not found.`);
    }
    const track = trackDoc.data();

    const newCourseData = {
        moduleId: track.moduleId,
        ...courseData,
        likes: 0,
        dislikes: 0,
    };

    const docRef = await addDoc(collection(db, 'courses'), newCourseData);

    return {
        id: docRef.id,
        ...newCourseData
    } as Course;
}

// Updates a course in Firestore.
export async function updateCourse(courseId: string, courseData: Partial<Omit<Course, 'id' | 'trackId' | 'moduleId'>>): Promise<void> {
    if (!courseId) {
        throw new Error("Course ID must be provided for update.");
    }
    const courseRef = doc(db, 'courses', courseId);
    await updateDoc(courseRef, courseData);
    return Promise.resolve();
}


// Creates a user in Firestore.
export async function createUser(userData: { name: string; email: string; password?: string; role: UserRole; area?: string; supervisor?: string; coordenador?: string; gerente?: string; diretor?: string; }): Promise<User> {
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
        throw new Error('E-mail já cadastrado.');
    }

    const newUser: Omit<User, 'id'> = {
        avatarUrl: `https://placehold.co/100x100.png`,
        completedCourses: [],
        completedTracks: [],
        courseScores: [],
        trackScores: [],
        ...userData,
        // Password should be handled by Firebase Auth, not stored here.
        // It's kept for now to avoid breaking the signup form action.
        password: userData.password,
    };

    const docRef = await addDoc(collection(db, "users"), newUser);

    return {
        id: docRef.id,
        ...newUser
    } as User;
}


// Updates a user in Firestore.
export async function updateUser(userId: string, userData: Partial<Omit<User, 'id'>>): Promise<User> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, userData);
    const updatedDoc = await getDoc(userRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as User;
}
