import type { User, Module, Track, Course, UserRole } from './types';
import { learningModules as initialModules, users as initialUsers } from './mock-data';

// --- In-Memory Data Store for Development ---
// IMPORTANT: To prevent stubborn caching issues with Next.js's Fast Refresh,
// we create fresh deep copies of the mock data in each function.
// This ensures that changes to mock-data.ts are always reflected.

function getFreshUsers(): User[] {
    return JSON.parse(JSON.stringify(initialUsers));
}

function getFreshModules(): Module[] {
    return JSON.parse(JSON.stringify(initialModules));
}


// --- Data Fetching Functions ---

// Fetch all learning modules and their nested tracks/courses from mock data
export async function getLearningModules(): Promise<Module[]> {
    return Promise.resolve(getFreshModules());
}

// Fetch all users from mock data
export async function getUsers(): Promise<User[]> {
    return Promise.resolve(getFreshUsers());
}

// Fetch a single user by ID from mock data
export async function getUserById(userId: string): Promise<User | null> {
    const allUsers = getFreshUsers();
    const user = allUsers.find(u => u.id === userId);
    return Promise.resolve(user || null);
}

// Fetch a single user by Email from mock data
export async function findUserByEmail(email: string): Promise<User | null> {
    const allUsers = getFreshUsers();
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    return Promise.resolve(user || null);
}


// Find a course by its ID within the mock data structure
export function findCourseById(courseId: string, modules?: Module[]): { course: Course, track: Track, module: Module } | null {
    const allModulesToSearch = modules || getFreshModules();
    for (const module of allModulesToSearch) {
        for (const track of module.tracks) {
            const course = track.courses.find(c => c.id === courseId);
            if (course) {
                return { course, track, module };
            }
        }
    }
    return null;
}

// Find a course and its parent track by the course ID
export async function findCourseByIdWithTrack(courseId: string): Promise<{ course: Course, track: Track } | null> {
    const allModules = getFreshModules();
    const result = findCourseById(courseId, allModules);
    if (result) {
        return { course: result.course, track: result.track };
    }
    return null;
}

// Finds the very first course that is not marked as completed for a given user.
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

// --- Mutation Functions (Simulated) ---
// IMPORTANT: These mutations will NOT persist if the dev server is restarted,
// as they modify a temporary copy of the data. To make permanent changes,
// edit src/lib/mock-data.ts directly and restart the server.

// Creates a course in-memory.
export async function createCourse(courseData: { trackId: string; title: string; description: string; videoUrl: string; thumbnailUrl?: string; durationInSeconds?: number; }): Promise<Course> {
    const allModules = getFreshModules(); // This is a temporary copy
    let trackToUpdate: Track | undefined;
    let moduleToUpdate: Module | undefined;

    for (const module of allModules) {
        trackToUpdate = module.tracks.find(t => t.id === courseData.trackId);
        if (trackToUpdate) {
            moduleToUpdate = module;
            break;
        }
    }

    if (!trackToUpdate || !moduleToUpdate) {
        throw new Error(`Track with ID ${courseData.trackId} not found.`);
    }

    const newCourse: Course = {
        id: `course-${Date.now()}`,
        moduleId: moduleToUpdate.id,
        trackId: trackToUpdate.id,
        title: courseData.title,
        description: courseData.description,
        videoUrl: courseData.videoUrl,
        thumbnailUrl: courseData.thumbnailUrl,
        durationInSeconds: courseData.durationInSeconds || 0,
        likes: 0,
        dislikes: 0,
    };

    trackToUpdate.courses.push(newCourse);
    // Note: This change happens on a copy and won't be reflected in subsequent calls
    // unless we were to write it back to the file system, which we are not.

    return Promise.resolve(newCourse);
}

// Updates a course in-memory.
export async function updateCourse(courseId: string, courseData: Partial<Omit<Course, 'id' | 'trackId' | 'moduleId'>>): Promise<void> {
    const allModules = getFreshModules(); // Temporary copy
    const result = findCourseById(courseId, allModules);
    if (!result) {
        throw new Error(`Course with ID ${courseId} not found for update.`);
    }
    
    // As this is a mock, we will just simulate success without actual persistence
    // across server reloads. The original findCourseById result object can be modified.
    Object.assign(result.course, courseData);

    return Promise.resolve();
}


// Creates a user in-memory.
export async function createUser(userData: { name: string; email: string; password?: string; role: UserRole; area?: string; supervisor?: string; coordenador?: string; gerente?: string; diretor?: string; }): Promise<User> {
    const allUsers = getFreshUsers();
    const existingUser = allUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
        throw new Error('E-mail já cadastrado.');
    }
    
    const newUser: User = {
        id: `user-${Date.now()}`,
        avatarUrl: `https://placehold.co/100x100.png`,
        completedCourses: [],
        completedTracks: [],
        courseScores: [],
        trackScores: [],
        ...userData,
        password: userData.password,
    };

    allUsers.push(newUser);
    
    return Promise.resolve(newUser);
}


// Updates a user in-memory.
export async function updateUser(userId: string, userData: Partial<Omit<User, 'id'>>): Promise<User> {
    const allUsers = getFreshUsers();
    const userIndex = allUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        throw new Error(`User with ID ${userId} not found for update.`);
    }

    const updatedUser = {
        ...allUsers[userIndex],
        ...userData
    };

    allUsers[userIndex] = updatedUser;

    return Promise.resolve(updatedUser);
}
