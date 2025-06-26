import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
      <BookOpen className="h-6 w-6 text-primary" />
      <span className="">Br Supply Academy</span>
    </Link>
  );
}
