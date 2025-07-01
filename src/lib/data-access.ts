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

// Simulates creating a course. The change is not persisted.
export async function createCourse(courseData: Omit<Course, 'id'>): Promise<Course> {
    console.log('Simulating course creation:', courseData);
    // In a mock environment, we can't persist this easily without complex state management.
    // We'll return a mock object that looks real for the UI.
    const newCourse: Course = {
        id: `mock-course-${Date.now()}`,
        // These are placeholder IDs as the course is not actually added to any module/track
        moduleId: 'mock-module-id', 
        trackId: 'mock-track-id', 
        ...courseData,
        quiz: courseData.quiz || undefined
    };
    return Promise.resolve(newCourse);
}

// Simulates updating a course. The change is not persisted.
export async function updateCourse(courseId: string, courseData: Partial<Course>): Promise<void> {
    console.log(`Simulating update for course ${courseId} with:`, courseData);
    // In a mock environment, this is a no-op (no operation).
    // The data is not actually changed in the mock-data.ts file.
    return Promise.resolve();
}
