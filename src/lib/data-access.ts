import type { User, Module, Track, Course, UserRole } from './types';
import { learningModules as initialModules, users as initialUsers } from './mock-data';

// --- In-Memory Data Store for Development ---
// IMPORTANT: This is an in-memory data store.
// Mutations (create, update) will persist only until the development server is restarted.
// Changes made directly to `src/lib/mock-data.ts` will also require a server restart to be reflected.
let allUsers: User[] = JSON.parse(JSON.stringify(initialUsers));
let allModules: Module[] = JSON.parse(JSON.stringify(initialModules));


// --- Data Fetching Functions ---

// Fetch all learning modules and their nested tracks/courses from mock data
export async function getLearningModules(): Promise<Module[]> {
    return Promise.resolve(allModules);
}

// Fetch all users from mock data
export async function getUsers(): Promise<User[]> {
    return Promise.resolve(allUsers);
}

// Fetch a single user by ID from mock data
export async function getUserById(userId: string): Promise<User | null> {
    const user = allUsers.find(u => u.id === userId);
    return Promise.resolve(user || null);
}

// Fetch a single user by Email from mock data
export async function findUserByEmail(email: string): Promise<User | null> {
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    return Promise.resolve(user || null);
}


// Find a course by its ID within the mock data structure
export function findCourseById(courseId: string, modules?: Module[]): { course: Course, track: Track, module: Module } | null {
    const allModulesToSearch = modules || allModules;
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

// Creates a course in-memory. The change persists for the lifetime of the dev server.
export async function createCourse(courseData: { trackId: string; title: string; description: string; videoUrl: string; thumbnailUrl?: string; durationInSeconds?: number; }): Promise<Course> {
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

    return Promise.resolve(newCourse);
}

// Updates a course in-memory. The change persists for the lifetime of the dev server.
export async function updateCourse(courseId: string, courseData: Partial<Omit<Course, 'id' | 'trackId' | 'moduleId'>>): Promise<void> {
    const result = findCourseById(courseId, allModules);
    if (!result) {
        throw new Error(`Course with ID ${courseId} not found for update.`);
    }

    const { track, module } = result;

    const moduleIndex = allModules.findIndex(m => m.id === module.id);
    if (moduleIndex === -1) {
        throw new Error(`Module not found during update.`);
    }

    const trackIndex = allModules[moduleIndex].tracks.findIndex(t => t.id === track.id);
    if (trackIndex === -1) {
        throw new Error(`Track not found during update.`);
    }

    const courseIndex = allModules[moduleIndex].tracks[trackIndex].courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) {
        throw new Error(`Course not found in its track during update.`);
    }

    // Explicitly update the object in the array by creating a new object
    const originalCourse = allModules[moduleIndex].tracks[trackIndex].courses[courseIndex];
    allModules[moduleIndex].tracks[trackIndex].courses[courseIndex] = {
        ...originalCourse,
        ...courseData
    };

    return Promise.resolve();
}


// Creates a user in-memory. The change persists for the lifetime of the dev server.
export async function createUser(userData: { name: string; email: string; password?: string; role: UserRole; area?: string; supervisor?: string; coordenador?: string; gerente?: string; diretor?: string; }): Promise<User> {
    const existingUser = await findUserByEmail(userData.email);
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
        // In a real app, hash this!
        password: userData.password,
    };

    allUsers.push(newUser);

    return Promise.resolve(newUser);
}


// Updates a user in-memory. The change persists for the lifetime of the dev server.
export async function updateUser(userId: string, userData: Partial<Omit<User, 'id'>>): Promise<User> {
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
