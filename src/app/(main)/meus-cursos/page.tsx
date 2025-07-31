

import { getLearningModules, findNextCourseForUser, filterModulesForUser } from "@/lib/data-access";
import { UserNotFound } from "@/components/layout/user-not-found";
import { getCurrentUser } from "@/lib/auth";
import { MyCoursesPageContent } from "./meus-cursos-client";

// This is a Server Component, responsible for fetching data.
export default async function MyCoursesPage() {
  const currentUser = await getCurrentUser();
  const allModules = await getLearningModules();

  if (!currentUser) {
    return <UserNotFound />
  }

  // Fetch all necessary data on the server.
  const learningModules = filterModulesForUser(allModules, currentUser);
  const nextCourse = await findNextCourseForUser(currentUser);
  
  // Pass the fetched data as props to the Client Component.
  return (
    <MyCoursesPageContent 
        learningModules={learningModules}
        currentUser={currentUser}
        nextCourse={nextCourse}
    />
  );
}
