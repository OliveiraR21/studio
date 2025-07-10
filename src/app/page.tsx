
import { LoginPageClient } from "@/components/auth/login-page-client";
import { TrendingCourses } from "@/components/auth/trending-courses";

export default async function LoginPage() {

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background Iframe for YouTube */}
      <div className="absolute top-0 left-0 w-full h-full z-[-2] pointer-events-none">
        <iframe
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '177.77vh', // 100 * (16/9)
            minWidth: '100vw',
            height: '100vw', // 100 * (9/16)
            minHeight: '100vh',
            objectFit: 'cover'
          }}
          src="https://www.youtube.com/embed/NgPkB-5-v6Y?autoplay=1&mute=1&loop=1&playlist=NgPkB-5-v6Y&controls=0&showinfo=0&modestbranding=1&iv_load_policy=3&rel=0"
          allow="autoplay; encrypted-media;"
          title="YouTube background video"
          data-ai-hint="background video"
        ></iframe>
      </div>
      
      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-[-1]"></div>

      {/* Login Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
        <div className="grid w-full max-w-[380px] gap-6 text-center text-white mb-16">
            <div className="grid gap-2">
                <h1 className="text-3xl font-bold">
                  <span className="text-primary">Br</span> Supply | Academia
                </h1>
            </div>
            <LoginPageClient />
            <div className="flex justify-center">
                <img
                    src="/br-supply-logo.png"
                    alt="Br Supply Logo"
                    className="h-28"
                    data-ai-hint="logo"
                />
            </div>
        </div>
        
        <TrendingCourses />

      </div>
    </div>
  );
}
