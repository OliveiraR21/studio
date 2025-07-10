
import Link from "next/link";
import { LoginPageClient } from "@/components/auth/login-page-client";
import { Globe, Briefcase, Linkedin, Youtube, Info, Shield, Facebook } from "lucide-react";

// Custom SVG component for the Oceano logo to match branding
const OceanoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
    >
        <defs>
            <linearGradient id="oceanoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#00D4FF', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#005C7A', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        <path d="M7 16a5 5 0 0 1-5-5 5 5 0 0 1 5-5" stroke="url(#oceanoGradient)" strokeWidth="2.5" />
        <path d="M17 16a5 5 0 0 0 5-5 5 5 0 0 0-5-5" stroke="url(#oceanoGradient)" strokeWidth="2.5" />
        <circle cx="12" cy="12" r="4" stroke="url(#oceanoGradient)" strokeWidth="2.5" />
    </svg>
);


export default async function LoginPage() {
  
  const footerLinks = [
    { name: "Site", href: "https://brsupply.com.br/", icon: Globe },
    { name: "Supply Manager", href: "#", icon: Briefcase },
    { name: "Oceano", href: "https://www.oceanob2b.com/", icon: OceanoIcon },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/brsupply-suprimentos-corporativos/posts/?feedView=all", icon: Linkedin },
    { name: "Youtube", href: "https://www.youtube.com/@brsupplysuprimentos", icon: Youtube },
    { name: "Facebook", href: "https://www.facebook.com/brsupply.suprimentos.corporativos", icon: Facebook },
    { name: "SIC", href: "#", icon: Info },
    { name: "Contato Seguro", href: "#", icon: Shield },
  ];

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
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

      {/* Main Content Area */}
      <div className="z-10 w-full max-w-[380px]">
        <LoginPageClient />
      </div>

       {/* Footer with links */}
      <footer className="absolute bottom-4 left-4 right-4 z-10">
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-4">
            {footerLinks.map((link) => {
                const Icon = link.icon;
                return (
                    <li key={link.name}>
                        <a 
                            href={link.href} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center justify-center h-10 w-10 rounded-full border border-muted-foreground/50 text-muted-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors"
                            aria-label={link.name}
                        >
                            <Icon className="h-5 w-5" />
                        </a>
                    </li>
                )
            })}
        </ul>
      </footer>
    </div>
  );
}
