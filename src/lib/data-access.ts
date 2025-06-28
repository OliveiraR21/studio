import { collection, getDocs, doc, getDoc, addDoc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import type { User, Module, Track, Course } from './types';

// Helper to convert Firestore doc to a typed object with ID
function docToType<T>(d: any): T {
    const data = d.data();
    return {
        ...data,
        id: d.id,
    } as T;
}

// Fetch all learning modules and their nested tracks/courses
export async function getLearningModules(): Promise<Module[]> {
    const modulesQuery = query(collection(db, 'modules'), orderBy('title'));
    const tracksQuery = query(collection(db, 'tracks'), orderBy('title'));
    const coursesQuery = query(collection(db, 'courses'), orderBy('title'));

    const [moduleSnap, trackSnap, courseSnap] = await Promise.all([
        getDocs(modulesQuery),
        getDocs(tracksQuery),
        getDocs(coursesQuery),
    ]);

    const courses = courseSnap.docs.map(docToType<Course>);
    const tracks = trackSnap.docs.map(docToType<Track>);
    const modules = moduleSnap.docs.map(docToType<Module>);

    // Nest courses into tracks
    tracks.forEach(track => {
        track.courses = courses.filter(c => c.trackId === track.id);
    });

    // Nest tracks into modules
    modules.forEach(module => {
        module.tracks = tracks.filter(t => t.moduleId === module.id);
    });

    return modules;
}

export async function getUsers(): Promise<User[]> {
    const usersCollection = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollection);
    return userSnapshot.docs.map(docToType<User>);
}

export async function getUserById(userId: string): Promise<User | null> {
    const userDocRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userDocRef);
    return userSnap.exists() ? docToType<User>(userSnap) : null;
}

export async function findCourseById(courseId: string, modules?: Module[]): Promise<{ course: Course, track: Track, module: Module } | null> {
    const allModules = modules || await getLearningModules();
    for (const module of allModules) {
        for (const track of module.tracks) {
            const course = track.courses.find(c => c.id === courseId);
            if (course) {
                return { course, track, module };
            }
        }
    }
    return null;
}

export async function findCourseByIdWithTrack(courseId: string): Promise<{ course: Course, track: Track } | null> {
    const courseDocRef = doc(db, 'courses', courseId);
    const courseSnap = await getDoc(courseDocRef);

    if (!courseSnap.exists()) {
        return null;
    }
    const course = docToType<Course>(courseSnap);
    
    if (!course.trackId) {
        return null;
    }
    
    const trackDocRef = doc(db, 'tracks', course.trackId);
    const trackSnap = await getDoc(trackDocRef);

    if (!trackSnap.exists()) {
        return null;
    }
    const track = docToType<Track>(trackSnap);

    return { course, track };
}

// Finds the very first course that is not marked as completed.
export function findNextCourseForUser(user: User, modules: Module[]): Course | null {
    for (const module of modules) {
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
export async function createCourse(courseData: Omit<Course, 'id'>): Promise<Course> {
    const courseCollection = collection(db, 'courses');
    const docRef = await addDoc(courseCollection, courseData);
    return {
        id: docRef.id,
        ...courseData,
    }
}

export async function updateCourse(courseId: string, courseData: Partial<Course>): Promise<void> {
    const courseDocRef = doc(db, 'courses', courseId);
    await updateDoc(courseDocRef, courseData);
}
