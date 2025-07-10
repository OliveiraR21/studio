import Link from "next/link";
import { LoginPageClient } from "@/components/auth/login-page-client";
import { Globe, Briefcase, Linkedin, Youtube, Shield, Facebook, Waves } from "lucide-react";


export default async function LoginPage() {
  
  // Custom SVG icon for SIC to match the other icons' style
  const SicIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 15V9h2.5a2.5 2.5 0 0 1 0 5H9" />
      <path d="M14.5 15V9" />
      <path d="M14.5 12a2.5 2.5 0 0 1 3-2.5" />
    </svg>
  );

  const footerLinks = [
    { name: "Site", href: "https://brsupply.com.br/", icon: Globe },
    { name: "Supply Manager", href: "#", icon: Briefcase },
    { name: "Oceano", href: "https://www.oceanob2b.com/", icon: Waves },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/brsupply-suprimentos-corporativos/posts/?feedView=all", icon: Linkedin },
    { name: "Youtube", href: "https://www.youtube.com/@brsupplysuprimentos", icon: Youtube },
    { name: "Facebook", href: "https://www.facebook.com/brsupply.suprimentos.corporativos", icon: Facebook },
    { name: "SIC", href: "https://intranet.brsupply.com.br/Intranet/index.php", icon: SicIcon },
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
