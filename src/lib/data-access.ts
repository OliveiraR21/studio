
// In-memory data store
import type { User, Module, Track, Course, UserRole, Notification, AnalyticsData, Question, QuestionProficiency, EngagementStats, ManagerPerformance } from './types';
import { learningModules as mockModules, users as mockUsers } from './mock-data';
import { userHasCourseAccess } from './access-control';
import { differenceInDays } from 'date-fns';
import { cache } from 'react';

// --- EXEMPLO DE MIGRAÇÃO PARA BANCO DE DADOS (usando Prisma) ---
// Quando chegar a hora de usar um banco de dados real, a gente faria algo assim:
// 1. Instalaria o Prisma: `npm install prisma @prisma/client`
// 2. Inicializaria o Prisma: `npx prisma init`
// 3. Modelaria o banco no arquivo `prisma/schema.prisma`
// 4. Importaria o cliente do Prisma aqui:
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// 5. Substituiria as funções abaixo para usar `prisma.user.findMany()`, etc.

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
  // EXEMPLO COM PRISMA:
  // return prisma.module.findMany({
  //   include: {
  //     tracks: {
  //       include: {
  //         courses: true,
  //       },
  //     },
  //   },
  // });
  return Promise.resolve(global.a_modules);
});

// Fetch all users
export const getUsers = cache(async (): Promise<User[]> => {
    // EXEMPLO COM PRISMA:
    // return prisma.user.findMany();
    return Promise.resolve(global.a_users);
});

// Fetch a single user by ID
export const getUserById = cache(async (userId: string): Promise<User | null> => {
    // EXEMPLO COM PRISMA:
    // return prisma.user.findUnique({ where: { id: userId } });
    const user = global.a_users.find(u => u.id === userId);
    return Promise.resolve(user || null);
});

// Fetch a single user by Email
export async function findUserByEmail(email: string): Promise<User | null> {
    // EXEMPLO COM PRISMA:
    // return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    const user = global.a_users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return Promise.resolve(user || null);
}

// Find a course by its ID, and include its parent module and track.
export const findCourseById = cache(async (courseId: string): Promise<{ course: Course, track: Track, module: Module } | null> => {
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
});

// Find a module by its ID.
export const findModuleById = cache(async (moduleId: string): Promise<Module | null> => {
    const modules = await getLearningModules();
    const module = modules.find(m => m.id === moduleId);
    return Promise.resolve(module || null);
});


// Find a track by its ID, and include its parent module
export const findTrackById = cache(async (trackId: string): Promise<{ track: Track, module: Module } | null> => {
    const modules = await getLearningModules();
    for (const module of modules) {
        for (const track of module.tracks) {
            if (track.id === trackId) {
                return Promise.resolve({ track, module });
            }
        }
    }
    return Promise.resolve(null);
});


// Find a course and its parent track by the course ID
export const findCourseByIdWithTrack = cache(async (courseId: string): Promise<{ course: Course, track: Track } | null> => {
    const result = await findCourseById(courseId);
    if (result) {
        return { course: result.course, track: result.track };
    }
    return null;
});

// Finds the very first course that is not marked as completed for a given user.
export async function findNextCourseForUser(user: User): Promise<(Course & {trackId: string}) | null> {
  const modules = await getLearningModules();
  for (const module of modules) {
      const sortedTracks = [...module.tracks].sort((a,b) => (a.order || Infinity) - (b.order || Infinity));
      for (const track of sortedTracks) {
          const sortedCourses = [...track.courses].sort((a,b) => (a.order ?? Infinity) - (b.order ?? Infinity));
          for (const course of sortedCourses) {
              if (!user.completedCourses.includes(course.id)) {
                // Check if the user has access to this course before returning it
                if (userHasCourseAccess(user, course)) {
                    return Promise.resolve({ ...course, trackId: track.id });
                }
              }
          }
      }
  }
  return Promise.resolve(null); // All accessible courses completed
}

// --- Mutation Functions ---

// Creates a course in the in-memory store.
export async function createCourse(
    courseData: Omit<Course, 'id' | 'createdAt'> & { trackId: string }
): Promise<Course> {
    const result = await findTrackById(courseData.trackId);
    if (!result) {
        throw new Error(`Track with ID ${courseData.trackId} not found.`);
    }

    const newCourse: Course = {
        ...courseData,
        id: `course-${Date.now()}-${Math.random()}`,
        moduleId: result.module.id, // Ensure moduleId is set on creation
        trackId: result.track.id, // Ensure trackId is set on creation
        createdAt: new Date(),
        likes: 0,
        dislikes: 0,
    };

    result.track.courses.push(newCourse);
    return Promise.resolve(newCourse);
}

// Updates a course in the in-memory store.
export async function updateCourse(
    courseId: string, 
    courseData: Partial<Omit<Course, 'id' | 'trackId' | 'moduleId'>>
): Promise<void> {
    const result = await findCourseById(courseId);

    if (!result) {
        throw new Error(`Course with ID ${courseId} not found for update.`);
    }

    // Update base course properties
    Object.assign(result.course, courseData);
    
    return Promise.resolve();
}


// Deletes a course from the in-memory store.
export async function deleteCourse(courseId: string): Promise<boolean> {
    let courseFound = false;
    
    global.a_modules.forEach(mod => {
        mod.tracks.forEach(track => {
            const courseIndex = track.courses.findIndex(c => c.id === courseId);
            if (courseIndex !== -1) {
                track.courses.splice(courseIndex, 1);
                courseFound = true;
            }
        });
    });

    if (!courseFound) {
        throw new Error(`Course with ID ${courseId} not found for deletion.`);
    }

    return Promise.resolve(true);
}


// Updates a track in the in-memory store.
export async function updateTrack(
  trackId: string,
  trackData: Partial<Omit<Track, 'id' | 'moduleId'>>
): Promise<void> {
  const result = await findTrackById(trackId);
  if (!result) {
    throw new Error(`Track with ID ${trackId} not found for update.`);
  }

  Object.assign(result.track, trackData);
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


// --- Notification Functions ---

export async function getNotificationsForUser(user: User): Promise<Notification[]> {
    const notifications: Notification[] = [];
    const allModules = await getLearningModules();
    const today = new Date();
    
    const allCourses = allModules.flatMap(m => m.tracks.flatMap(t => t.courses));

    for (const course of allCourses) {
        // Notify about new courses added in the last 7 days that the user has access to
        if (differenceInDays(today, course.createdAt) <= 7) {
            if (userHasCourseAccess(user, course)) {
                 const details = await findCourseByIdWithTrack(course.id);
                 if (details) {
                    notifications.push({
                        id: `notif-new-${course.id}`,
                        title: 'Novo curso disponível!',
                        description: `O curso "${course.title}" foi adicionado à trilha "${details.track.title}".`,
                        createdAt: course.createdAt,
                        read: false, // For this demo, notifications are always unread initially
                        href: `/courses/${course.id}`,
                    });
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


const getSubordinates = (managerName: string, allUsers: User[]): User[] => {
    const directReports = allUsers.filter(u => 
        u.supervisor === managerName ||
        u.coordenador === managerName ||
        u.gerente === managerName ||
        u.diretor === managerName
    );

    let allSubordinates = [...directReports];

    directReports.forEach(report => {
        const subordinatesOfReport = getSubordinates(report.name, allUsers);
        allSubordinates = [...allSubordinates, ...subordinatesOfReport];
    });
    
    return [...new Map(allSubordinates.map(item => [item.id, item])).values()];
};

// --- Analytics Functions ---

// NOTE: The data generated here is for demonstration purposes.
// In a real application, this would be calculated from user interaction data.
export async function getAnalyticsData(): Promise<AnalyticsData> {
  const allModules = await getLearningModules();
  const allUsers = await getUsers();
  const allCourses = allModules.flatMap(m => m.tracks.flatMap(t => t.courses));
  const totalCourses = allCourses.length || 1;

  // 1. Calculate Question Proficiency (Simulated)
  const allQuestions: { question: Question, course: Course }[] = [];
  allCourses.forEach(course => {
    if (course.quiz && course.quiz.questions.length > 0) {
      course.quiz.questions.forEach(question => {
        allQuestions.push({ question, course });
      });
    }
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

  // 2. Totals
  const totalUsers = allUsers.length;
  
  // 3. Engagement Stats (Calculate real completion rate)
  const totalCompletionSum = allUsers.reduce((sum, user) => {
      const userCompletionPercentage = (user.completedCourses.length / totalCourses) * 100;
      return sum + userCompletionPercentage;
  }, 0);

  const averageCompletionRate = totalUsers > 0 ? Math.round(totalCompletionSum / totalUsers) : 0;
  
  const engagementStats: EngagementStats = {
    avgSessionTime: "25 min", // Simulated
    peakTime: "14h - 16h", // Simulated
    completionRate: averageCompletionRate,
  };
  
  // 4. Manager/Team Performance
  const managerRoles: UserRole[] = ['Supervisor', 'Coordenador', 'Gerente', 'Diretor'];
  const managers = allUsers.filter(u => managerRoles.includes(u.role));
  
  const calculateAverageScore = (user: User): number => {
      const allScores = [...(user.courseScores ?? []).map(s => s.score), ...(user.trackScores ?? []).map(s => s.score)];
      if (allScores.length === 0) return 0;
      return Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
  };

  const managerPerformance: ManagerPerformance[] = managers.map(manager => {
      const teamMembers = getSubordinates(manager.name, allUsers);
      
      if (teamMembers.length === 0) {
          return { managerName: manager.name, completionRate: 0, averageScore: 0 };
      }
      
      const teamCompletionSum = teamMembers.reduce((sum, member) => {
          const memberCompletionPercentage = (member.completedCourses.length / totalCourses) * 100;
          return sum + memberCompletionPercentage;
      }, 0);

      const teamScoreSum = teamMembers.reduce((sum, member) => {
          return sum + calculateAverageScore(member);
      }, 0);
      
      const averageCompletion = Math.round(teamCompletionSum / teamMembers.length);
      const averageScore = Math.round(teamScoreSum / teamMembers.length);

      return { managerName: manager.name, completionRate: averageCompletion, averageScore: averageScore };
  }).sort((a, b) => b.completionRate - a.completionRate);


  return Promise.resolve({
    questionProficiency,
    engagementStats,
    managerPerformance,
    totalUsers,
    totalCourses,
  });
}

/**
 * Filters a list of learning modules for a specific user.
 * - Removes courses to which the user does not have access.
 * - Removes tracks that become empty after filtering courses (unless the user is Admin/Director).
 * - Removes modules that become empty after filtering tracks.
 * @param allModules The complete list of modules.
 * @param currentUser The logged-in user.
 * @returns A new list of modules containing only content accessible by the user.
 */
export function filterModulesForUser(allModules: Module[], currentUser: User): Module[] {
  const canSeeAllRoles: User['role'][] = ['Admin', 'Diretor'];
  const userCanSeeAll = canSeeAllRoles.includes(currentUser.role);

  // The .map() creates a new list, preserving the original.
  return allModules.map(module => {
    // 1. Filter the tracks within each module
    const filteredTracks = module.tracks
      .map(track => {
        // 2. Filter the courses within each track
        const accessibleCourses = track.courses
          .filter(course => userHasCourseAccess(currentUser, course))
          .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
        
        // Return the track with only the accessible courses
        return {
          ...track,
          courses: accessibleCourses
        };
      })
      // 3. Remove tracks that have become empty (no courses)
      .filter(track => userCanSeeAll || track.courses.length > 0 || (track.quiz && track.quiz.questions.length > 0))
      .sort((a, b) => (a.order || Infinity) - (b.order || Infinity));

    // Return the module with only the tracks that have survived the filter
    return {
      ...module,
      tracks: filteredTracks,
    };
  })
  // 4. Finally, remove modules that have become empty (no tracks)
  .filter(module => module.tracks.length > 0);
}
