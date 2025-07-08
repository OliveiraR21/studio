// In-memory data store
import type { User, Module, Track, Course, UserRole } from './types';
import { learningModules as mockModules, users as mockUsers } from './mock-data';

// A simple in-memory database.
// In a real app, you would use a database like Firestore or Prisma.
// The 'a_' prefix is to avoid naming conflicts with the global object.
declare global {
  // eslint-disable-next-line no-var
  var a_users: User[];
  // eslint-disable-next-line no-var
  var a_modules: Module[];
}

if (!global.a_users) {
  // Deep copy to avoid modifying the original mock data during runtime.
  global.a_users = JSON.parse(JSON.stringify(mockUsers));
  global.a_modules = JSON.parse(JSON.stringify(mockModules));
}


// --- Data Fetching Functions ---

// Fetch all learning modules and their nested tracks/courses
export async function getLearningModules(): Promise<Module[]> {
  return Promise.resolve(global.a_modules);
}

// Fetch all users
export async function getUsers(): Promise<User[]> {
    return Promise.resolve(global.a_users);
}

// Fetch a single user by ID
export async function getUserById(userId: string): Promise<User | null> {
    const user = global.a_users.find(u => u.id === userId);
    return Promise.resolve(user || null);
}

// Fetch a single user by Email
export async function findUserByEmail(email: string): Promise<User | null> {
    const user = global.a_users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return Promise.resolve(user || null);
}


// Find a course by its ID, and include its parent module and track.
export async function findCourseById(courseId: string): Promise<{ course: Course, track: Track, module: Module } | null> {
  for (const module of global.a_modules) {
    for (const track of module.tracks) {
      const course = track.courses.find(c => c.id === courseId);
      if (course) {
        return Promise.resolve({ course, track, module });
      }
    }
  }
  return Promise.resolve(null);
}


// Find a course and its parent track by the course ID
export async function findCourseByIdWithTrack(courseId: string): Promise<{ course: Course, track: Track } | null> {
  for (const module of global.a_modules) {
    for (const track of module.tracks) {
      const course = track.courses.find(c => c.id === courseId);
      if (course) {
        // Return a deep copy to avoid mutations affecting the global store
        return Promise.resolve(JSON.parse(JSON.stringify({ course, track })));
      }
    }
  }
  return Promise.resolve(null);
}

// Finds the very first course that is not marked as completed for a given user.
export async function findNextCourseForUser(user: User): Promise<Course | null> {
    for (const module of global.a_modules) {
        for (const track of module.tracks) {
            for (const course of track.courses) {
                if (!user.completedCourses.includes(course.id)) {
                    return Promise.resolve(course);
                }
            }
        }
    }
    return Promise.resolve(null); // All courses completed
}

// --- Mutation Functions ---

// Creates a course in the in-memory store.
export async function createCourse(courseData: { trackId: string; title: string; description: string; videoUrl: string; thumbnailUrl?: string; durationInSeconds?: number; }): Promise<Course> {
    let parentModule: Module | undefined;
    let parentTrack: Track | undefined;

    for (const mod of global.a_modules) {
        const foundTrack = mod.tracks.find(t => t.id === courseData.trackId);
        if (foundTrack) {
            parentModule = mod;
            parentTrack = foundTrack;
            break;
        }
    }

    if (!parentModule || !parentTrack) {
        throw new Error(`Track with ID ${courseData.trackId} not found.`);
    }

    const newCourse: Course = {
        id: `course-${Date.now()}-${Math.random()}`,
        moduleId: parentModule.id,
        likes: 0,
        dislikes: 0,
        ...courseData,
    };
    parentTrack.courses.push(newCourse);
    return Promise.resolve(newCourse);
}

// Updates a course in the in-memory store.
export async function updateCourse(courseId: string, courseData: Partial<Omit<Course, 'id' | 'trackId' | 'moduleId'>>): Promise<void> {
    let courseToUpdate: Course | undefined;
    for (const mod of global.a_modules) {
        for (const track of mod.tracks) {
            const courseIndex = track.courses.findIndex(c => c.id === courseId);
            if (courseIndex !== -1) {
                // Update the course in place to ensure the global store is modified
                track.courses[courseIndex] = { ...track.courses[courseIndex], ...courseData };
                courseToUpdate = track.courses[courseIndex];
                break;
            }
        }
        if (courseToUpdate) break;
    }

    if (!courseToUpdate) {
        throw new Error(`Course with ID ${courseId} not found for update.`);
    }

    return Promise.resolve();
}


// Creates a user in the in-memory store.
export async function createUser(userData: { name: string; email: string; password?: string; role: UserRole; area?: string; supervisor?: string; coordenador?: string; gerente?: string; diretor?: string; }): Promise<User> {
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
        throw new Error('E-mail já cadastrado.');
    }

    const newUser: User = {
        id: `user-${Date.now()}-${Math.random()}`,
        avatarUrl: `https://placehold.co/100x100.png`,
        completedCourses: [],
        completedTracks: [],
        courseScores: [],
        trackScores: [],
        ...userData,
    };

    global.a_users.push(newUser);
    return Promise.resolve(newUser);
}


// Updates a user in the in-memory store.
export async function updateUser(userId: string, userData: Partial<Omit<User, 'id'>>): Promise<User> {
    const userIndex = global.a_users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        throw new Error(`User with ID ${userId} not found.`);
    }
    const updatedUser = { ...global.a_users[userIndex], ...userData };
    global.a_users[userIndex] = updatedUser;
    return Promise.resolve(updatedUser);
}
