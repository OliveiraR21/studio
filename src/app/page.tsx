
import Link from "next/link";
import { LoginPageClient } from "@/components/auth/login-page-client";
import { Globe, Briefcase, Linkedin, Youtube, Info, Shield, Waves } from "lucide-react";

export default async function LoginPage() {
  
  const footerLinks = [
    { name: "Site", href: "https://brsupply.com.br/", icon: Globe },
    { name: "Supply Manager", href: "#", icon: Briefcase },
    { name: "Oceano", href: "https://www.oceanob2b.com/", icon: Waves },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/brsupply-suprimentos-corporativos/posts/?feedView=all", icon: Linkedin },
    { name: "Youtube", href: "https://www.youtube.com/@brsupplysuprimentos", icon: Youtube },
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
      <div className="z-10 w-full max-w-md">
        <LoginPageClient />
      </div>

       {/* Footer with links */}
      <footer className="absolute bottom-4 left-4 right-4 z-10">
        <div className="w-full max-w-5xl mx-auto p-4 border border-white/10 bg-black/20 backdrop-blur-sm rounded-xl">
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                {footerLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                        <li key={link.name}>
                            <a 
                                href={link.href} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Icon className="h-4 w-4" />
                                <span>{link.name}</span>
                            </a>
                        </li>
                    )
                })}
            </ul>
        </div>
      </footer>
    </div>
  );
}
