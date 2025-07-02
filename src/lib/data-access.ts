import type { User, Module, Track, Course } from './types';
import { learningModules as allModules, users as allUsers } from './mock-data';

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
    const result = findCourseById(courseId);
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
export async function createCourse(courseData: { trackId: string; title: string; description: string; videoUrl: string; durationInSeconds?: number; }): Promise<Course> {
    console.log('Creating course in-memory:', courseData);
    
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
        durationInSeconds: courseData.durationInSeconds || 0,
    };

    trackToUpdate.courses.push(newCourse);
    
    console.log(`Course "${newCourse.title}" added to track "${trackToUpdate.title}". Current courses in track: ${trackToUpdate.courses.length}`);

    return Promise.resolve(newCourse);
}

// Updates a course in-memory. The change persists for the lifetime of the dev server.
export async function updateCourse(courseId: string, courseData: Partial<Omit<Course, 'id' | 'trackId' | 'moduleId'>>): Promise<void> {
    console.log(`Updating course ${courseId} in-memory with:`, courseData);

    const result = findCourseById(courseId);
    if (!result) {
        throw new Error(`Course with ID ${courseId} not found for update.`);
    }

    // Update the course object. In JS, this modifies the object in the `allModules` array by reference.
    Object.assign(result.course, courseData);

    console.log(`Course "${result.course.title}" updated.`);

    return Promise.resolve();
}
