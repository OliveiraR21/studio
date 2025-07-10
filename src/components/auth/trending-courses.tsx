
import { getLearningModules } from "@/lib/data-access";
import { cn } from "@/lib/utils";
import Link from "next/link";

export async function TrendingCourses() {
    const allModules = await getLearningModules();

    // 1. Flatten all courses from all modules and tracks
    const allCourses = allModules.flatMap(module => 
        module.tracks.flatMap(track => track.courses)
    );

    // 2. Filter courses that are public (no role or area restrictions)
    const publicCourses = allCourses.filter(course => {
        const isRoleRestricted = course.minimumRole && course.minimumRole !== 'none';
        const isAreaRestricted = course.accessAreas && course.accessAreas.length > 0;
        return !isRoleRestricted && !isAreaRestricted;
    });

    // 3. Sort by likes in descending order and take the top 5
    const trendingCourses = publicCourses
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 5);

    if (trendingCourses.length === 0) {
        return null; // Don't render the section if there are no trending courses
    }
    
    // We need at least 5 items for the grid to look right, so we'll duplicate if needed for the placeholder.
    while (trendingCourses.length > 0 && trendingCourses.length < 5) {
        trendingCourses.push(trendingCourses[0]);
    }

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-white mb-4">Em alta</h2>
            <div className="flex space-x-2 overflow-x-auto pb-4">
                {trendingCourses.map((course, index) => (
                    <Link href={`/courses/${course.id}`} key={`${course.id}-${index}`} className="group relative flex-shrink-0">
                        <div 
                            className="w-48 h-28 rounded-md bg-muted flex items-center justify-center overflow-hidden transition-transform duration-300 ease-in-out group-hover:scale-105"
                        >
                            <img
                                src={course.thumbnailUrl || '/br-supply-logo.png'}
                                alt={course.title}
                                className={cn(
                                    "w-full h-full object-cover",
                                    !course.thumbnailUrl && "object-contain p-4"
                                )}
                                data-ai-hint="course thumbnail"
                            />
                        </div>
                        <div className="absolute -bottom-4 -left-3 flex items-end">
                            <span 
                                className="font-bebas text-8xl font-bold text-white transition-transform duration-300 ease-in-out group-hover:scale-110"
                                style={{
                                    WebkitTextStroke: '2px black',
                                    textStroke: '2px black',
                                    paintOrder: 'stroke fill',
                                }}
                            >
                                {index + 1}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
