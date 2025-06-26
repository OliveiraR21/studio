import { CourseCard } from "@/components/dashboard/course-card";
import { availableCourses } from "@/lib/data";

export default function DashboardPage() {
  // In a real app, we would fetch courses assigned to the logged-in user.
  // For demonstration, we'll show all available courses.
  const courses = availableCourses;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Your Learning Paths</h1>
      
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Assigned Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.slice(0, 4).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Explore New Skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.slice(4).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
