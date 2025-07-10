
import { findCourseByIdWithTrack, getUserById, getLearningModules } from "@/lib/data-access";
import { notFound } from "next/navigation";
import { CoursePageClient } from "./course-page-client";
import { getSimulatedUserId } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function CoursePage({ params }: { params: { id: string } }) {
  const result = await findCourseByIdWithTrack(params.id);

  if (!result) {
    notFound();
  }

  const { course, track } = result;

  // Fetch all modules for the playlist sidebar
  const allModules = await getLearningModules();

  // Check if the current user has already completed this course
  const userId = getSimulatedUserId();
  const user = await getUserById(userId);
  
  if (!user) {
      notFound(); // Or show a user not found component
  }

  const isAlreadyCompleted = user.completedCourses.includes(course.id);

  // Determine user's initial feedback state.
  // This is a simulation. In a real app, you'd query this from the DB.
  let initialFeedback: 'like' | 'dislike' | 'none' = 'none';
  const hasVoted = course.voters?.includes(userId);
  // This is a simplification: we assume if a user has voted, their last action was a like.
  // A real system would store the specific vote type.
  if (hasVoted) {
      initialFeedback = 'like';
  }


  return (
    <CoursePageClient 
        course={course} 
        track={track} 
        isAlreadyCompleted={isAlreadyCompleted} 
        initialFeedback={initialFeedback} 
        allModules={allModules}
        currentUser={user}
    />
  );
}
