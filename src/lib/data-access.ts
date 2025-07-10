
// In-memory data store
import type { User, Module, Track, Course, UserRole, Notification, AnalyticsData, Question, QuestionProficiency, EngagementStats } from './types';
import { learningModules as mockModules, users as mockUsers } from './mock-data';
import { userHasCourseAccess } from './access-control';
import { differenceInDays } from 'date-fns';
import { cache } from 'react';

// A simple in-memory database.
// In a real app, you would use a database like Firestore or Prisma.
// The 'a_' prefix is to avoid naming conflicts with the global object.
declare global {
  // eslint-disable-next-line no-var
  var a_users: User[];
  // eslint-disable-next-line no-var
  var a_modules: Module[];
}

// This pattern ensures that in a development environment with hot-reloading,
// our in-memory data isn't wiped out on every file change. The global object
// persists across reloads, so we only initialize the data if it's not already there.
// In production, this code runs only once when the server starts.
if (!global.a_users) {
  global.a_users = JSON.parse(JSON.stringify(mockUsers), (key, value) => {
    // Reviver function to convert ISO date strings back to Date objects
    if (key === 'createdAt' && typeof value === 'string') {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return date;
        }
    }
    return value;
  });
}
if (!global.a_modules) {
  global.a_modules = JSON.parse(JSON.stringify(mockModules), (key, value) => {
    if (key === 'createdAt' && typeof value === 'string') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return value;
  });
}


// --- Data Fetching Functions ---

// Fetch all learning modules and their nested tracks/courses
export const getLearningModules = cache(async (): Promise<Module[]> => {
  return Promise.resolve(global.a_modules);
});

// Fetch all users
export const getUsers = cache(async (): Promise<User[]> => {
    return Promise.resolve(global.a_users);
});

// Fetch a single user by ID
export const getUserById = cache(async (userId: string): Promise<User | null> => {
    const user = global.a_users.find(u => u.id === userId);
    return Promise.resolve(user || null);
});

// Fetch a single user by Email
export async function findUserByEmail(email: string): Promise<User | null> {
    const user = global.a_users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return Promise.resolve(user || null);
}


// Find a course by its ID, and include its parent module and track.
export async function findCourseById(courseId: string): Promise<{ course: Course, track: Track, module: Module } | null> {
  const modules = await getLearningModules();
  for (const module of modules) {
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
  const modules = await getLearningModules();
  for (const module of modules) {
    for (const track of module.tracks) {
      const course = track.courses.find(c => c.id === courseId);
      if (course) {
        // Return a deep copy to avoid mutations affecting the global store
        return Promise.resolve({ course, track });
      }
    }
  }
  return Promise.resolve(null);
}

// Finds the very first course that is not marked as completed for a given user.
export async function findNextCourseForUser(user: User): Promise<(Course & {trackId: string}) | null> {
    const modules = await getLearningModules();
    for (const module of modules) {
        for (const track of module.tracks) {
            for (const course of track.courses) {
                if (!user.completedCourses.includes(course.id)) {
                    // Check for access control using the hierarchical helper
                    if (userHasCourseAccess(user, course)) {
                        return Promise.resolve({...course, trackId: track.id});
                    }
                }
            }
        }
    }
    return Promise.resolve(null); // All accessible courses completed
}

// --- Mutation Functions ---

// Creates a course in the in-memory store.
export async function createCourse(courseData: { trackId: string; title: string; description: string; videoUrl: string; thumbnailUrl?: string; durationInSeconds?: number; minimumRole?: UserRole; accessAreas?: string[]; transcript?: string; }): Promise<Course> {
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
        createdAt: new Date(),
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

// Deletes a course from the in-memory store.
export async function deleteCourse(courseId: string): Promise<boolean> {
    let courseFoundAndDeleted = false;
    for (const mod of global.a_modules) {
        for (const track of mod.tracks) {
            const courseIndex = track.courses.findIndex(c => c.id === courseId);
            if (courseIndex !== -1) {
                track.courses.splice(courseIndex, 1);
                courseFoundAndDeleted = true;
                break;
            }
        }
        if (courseFoundAndDeleted) break;
    }

    if (!courseFoundAndDeleted) {
        throw new Error(`Course with ID ${courseId} not found for deletion.`);
    }

    return Promise.resolve(true);
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


// --- Notification Functions ---

export async function getNotificationsForUser(user: User): Promise<Notification[]> {
    const notifications: Notification[] = [];
    const allModules = await getLearningModules();
    const today = new Date();

    for (const module of allModules) {
        for (const track of module.tracks) {
            for (const course of track.courses) {
                // Notify about new courses added in the last 7 days that the user has access to
                if (differenceInDays(today, course.createdAt) <= 7) {
                    if (userHasCourseAccess(user, course)) {
                        notifications.push({
                            id: `notif-new-${course.id}`,
                            title: 'Novo curso disponível!',
                            description: `O curso "${course.title}" foi adicionado à trilha "${track.title}".`,
                            createdAt: course.createdAt,
                            read: false, // For this demo, notifications are always unread initially
                            href: `/courses/${course.id}`,
                        });
                    }
                }
            }
        }
    }
    
    // Notify about courses that need to be retaken
    const PASSING_SCORE = 90;
    const coursesToRetake = (user.courseScores ?? [])
        .filter(scoreInfo => scoreInfo.score < PASSING_SCORE);
    
    for (const scoreInfo of coursesToRetake) {
         const courseDetails = await findCourseById(scoreInfo.courseId);
         if (courseDetails && userHasCourseAccess(user, courseDetails.course)) {
             notifications.push({
                id: `notif-retake-${scoreInfo.courseId}`,
                title: 'Lembrete de estudo',
                description: `Você ainda não atingiu a nota mínima no curso "${courseDetails.course.title}".`,
                createdAt: new Date(), // Use current date for retake reminders
                read: false,
                href: `/courses/${scoreInfo.courseId}`,
             });
         }
    }

    // Sort notifications by date, newest first
    return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// --- Analytics Functions ---

// NOTE: The data generated here is for demonstration purposes.
// In a real application, this would be calculated from user interaction data.
export async function getAnalyticsData(): Promise<AnalyticsData> {
  const allModules = await getLearningModules();
  const allUsers = await getUsers();

  // 1. Calculate Question Proficiency (Simulated)
  const allQuestions: { question: Question, course: Course }[] = [];
  allModules.forEach(module => {
    module.tracks.forEach(track => {
      track.courses.forEach(course => {
        if (course.quiz && course.quiz.questions.length > 0) {
          course.quiz.questions.forEach(question => {
            allQuestions.push({ question, course });
          });
        }
      });
    });
  });

  const questionProficiency: QuestionProficiency[] = allQuestions.map(({ question, course }) => {
    // Simulate an error rate based on the question's text length and index.
    // This provides stable but varied "mock" data.
    const baseError = (question.text.length % 50) + 10; // Base error rate from 10 to 60
    const complexityFactor = question.options.reduce((acc, opt) => acc + opt.length, 0) / 100; // Factor in option complexity
    const errorRate = Math.min(95, baseError + complexityFactor); // Cap at 95%
    
    return {
      questionText: question.text,
      courseTitle: course.title,
      courseId: course.id,
      errorRate: Math.round(errorRate),
    };
  }).sort((a, b) => b.errorRate - a.errorRate) // Sort by highest error rate
  .slice(0, 10); // Take top 10

  // 2. Engagement Stats (Simulated)
  const engagementStats: EngagementStats = {
    avgSessionTime: "25 min",
    peakTime: "14h - 16h",
    completionRate: 82, // Percentage
  };

  // 3. Totals
  const totalUsers = allUsers.length;
  const totalCourses = allModules.flatMap(m => m.tracks.flatMap(t => t.courses)).length;
  
  return Promise.resolve({
    questionProficiency,
    engagementStats,
    totalUsers,
    totalCourses,
  });
}
