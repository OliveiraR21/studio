
import { findCourseByIdWithTrack, getUserById } from "@/lib/data-access";
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

  // Check if the current user has already completed this course
  const userId = getSimulatedUserId();
  const user = await getUserById(userId);
  const isAlreadyCompleted = user?.completedCourses.includes(course.id) || false;

  return <CoursePageClient course={course} track={track} isAlreadyCompleted={isAlreadyCompleted} />;
}
