import { findCourseByIdWithTrack } from "@/lib/data-access";
import { notFound } from "next/navigation";
import { CoursePageClient } from "./course-page-client";

export const dynamic = 'force-dynamic';

export default async function CoursePage({ params }: { params: { id: string } }) {
  const result = await findCourseByIdWithTrack(params.id);

  if (!result) {
    notFound();
  }

  const { course, track } = result;

  // By passing the raw data objects, we ensure Next.js handles serialization
  // correctly on each dynamic render, preventing stale data from being shown.
  return <CoursePageClient course={course} track={track} />;
}
