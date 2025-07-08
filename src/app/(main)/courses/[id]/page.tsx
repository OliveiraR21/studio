import { findCourseByIdWithTrack } from "@/lib/data-access";
import { notFound } from "next/navigation";
import { CoursePageClient } from "./course-page-client";

export default async function CoursePage({ params }: { params: { id: string } }) {
  const result = await findCourseByIdWithTrack(params.id);

  if (!result) {
    notFound();
  }

  const { course, track } = result;

  return <CoursePageClient course={course} track={track} />;
}
