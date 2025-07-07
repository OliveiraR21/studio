import type { User, Module, Track, Course, UserRole } from './types';
import { learningModules as initialModules, users as initialUsers } from './mock-data';

// --- In-Memory Data Store for Development ---
// This acts as a simple in-memory database. Changes will persist until the
// server is restarted. This is more reliable for development than constantly
// creating deep copies, which was causing data persistence issues.

let a_users: User[] = JSON.parse(JSON.stringify(initialUsers));
let a_learningModules: Module[] = JSON.parse(JSON.stringify(initialModules));


// --- Data Fetching Functions ---

// Fetch all learning modules and their nested tracks/courses
export async function getLearningModules(): Promise<Module[]> {
    return Promise.resolve(a_learningModules);
}

// Fetch all users
export async function getUsers(): Promise<User[]> {
    return Promise.resolve(a_users);
}

// Fetch a single user by ID
export async function getUserById(userId: string): Promise<User | null> {
    const user = a_users.find(u => u.id === userId);
    return Promise.resolve(user || null);
}

// Fetch a single user by Email
export async function findUserByEmail(email: string): Promise<User | null> {
    const user = a_users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return Promise.resolve(user || null);
}


// Find a course by its ID
export function findCourseById(courseId: string, modules?: Module[]): { course: Course, track: Track, module: Module } | null {
    const allModulesToSearch = modules || a_learningModules; // Use the in-memory store
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
    const result = findCourseById(courseId, a_learningModules);
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
// These mutations modify the in-memory "database" and will persist until the server restarts.

// Creates a course in-memory.
export async function createCourse(courseData: { trackId: string; title: string; description: string; videoUrl: string; thumbnailUrl?: string; durationInSeconds?: number; }): Promise<Course> {
    let trackToUpdate: Track | undefined;
    let moduleToUpdate: Module | undefined;

    for (const module of a_learningModules) {
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

// Updates a course in-memory. This version iterates through the data source to
// find and update the course object directly, ensuring data persistence.
export async function updateCourse(courseId: string, courseData: Partial<Omit<Course, 'id' | 'trackId' | 'moduleId'>>): Promise<void> {
    let courseFound = false;
    for (const module of a_learningModules) {
        for (const track of module.tracks) {
            const courseIndex = track.courses.findIndex(c => c.id === courseId);
            if (courseIndex !== -1) {
                // Found the course, update it directly in the main array.
                track.courses[courseIndex] = {
                    ...track.courses[courseIndex],
                    ...courseData
                };
                courseFound = true;
                break; // Exit inner loop
            }
        }
        if (courseFound) {
            break; // Exit outer loop
        }
    }

    if (!courseFound) {
        throw new Error(`Course with ID ${courseId} not found for update.`);
    }

    return Promise.resolve();
}


// Creates a user in-memory.
export async function createUser(userData: { name: string; email: string; password?: string; role: UserRole; area?: string; supervisor?: string; coordenador?: string; gerente?: string; diretor?: string; }): Promise<User> {
    const existingUser = a_users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
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

    a_users.push(newUser);
    
    return Promise.resolve(newUser);
}


// Updates a user in-memory.
export async function updateUser(userId: string, userData: Partial<Omit<User, 'id'>>): Promise<User> {
    const userIndex = a_users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        throw new Error(`User with ID ${userId} not found for update.`);
    }

    const updatedUser = {
        ...a_users[userIndex],
        ...userData
    };

    a_users[userIndex] = updatedUser;

    return Promise.resolve(updatedUser);
}
