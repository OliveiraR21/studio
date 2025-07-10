import Link from "next/link";
import { LoginPageClient } from "@/components/auth/login-page-client";
import { Globe, Briefcase, Linkedin, Youtube, Info, Shield, Facebook } from "lucide-react";


export default async function LoginPage() {
  
  const OceanoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 106 36" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M43.75,23.82a13.63,13.63,0,0,1-27.21.75" />
      <path d="M19.34,11.51a13.63,13.63,0,0,1,26.47-1.5" />
      <path d="M48,10.76a13.63,13.63,0,1,1-25.12,14" />
      <path d="M53.18,10.76a18.18,18.18,0,1,1-33.5,18.68" />
      <path d="M63.88,29.44a13.63,13.63,0,1,1,12.25-21.78" />
      <path d="M92,29.44a13.63,13.63,0,1,1,12.25-21.78" />
      <path d="M104.16,21.39a8.18,8.18,0,0,1-16.36,0" />
    </svg>
  );

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
    <div className="relative w-full min-h-screen flex flex-col items-center justify-between p-4 overflow-hidden">
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

      {/* Header with Logo */}
      <header className="w-full z-10 flex justify-center py-4">
          {/* Light mode logo */}
          <img
              src="/BrSupply.png"
              alt="Br Supply Logo"
              className="h-28 block dark:hidden"
              data-ai-hint="logo"
          />
          {/* Dark mode logo */}
          <img
              src="/br-supply-logo.png"
              alt="Br Supply Logo"
              className="h-28 hidden dark:block"
              data-ai-hint="logo"
          />
      </header>

      {/* Main Content Area */}
      <main className="z-10 w-full max-w-[380px] flex flex-col items-center">
        <LoginPageClient />
      </main>

       {/* Footer with links */}
      <footer className="w-full z-10 flex justify-center py-4">
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
