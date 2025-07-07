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
  
  // A simple way to pass data to client components without serializing complex types
  const coursePlain = JSON.parse(JSON.stringify(course));
  const trackPlain = JSON.parse(JSON.stringify(track));

  return <CoursePageClient course={coursePlain} track={trackPlain} />;
}
