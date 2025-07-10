import { LoginPageClient } from "@/components/auth/login-page-client";

export default async function LoginPage() {
  
  const footerLinks = [
    { name: "Site Br Supply", href: "https://brsupply.com.br/" },
    { name: "Supply Manager", href: "#" },
    { name: "LinkedIn Br Supply", href: "https://www.linkedin.com/company/brsupply-suprimentos-corporativos/posts/?feedView=all" },
    { name: "Youtube Br Supply", href: "https://www.youtube.com/@brsupplysuprimentos" },
    { name: "SIC", href: "#" },
    { name: "Contato Seguro", href: "#" },
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

      {/* Curved Orange background effect */}
       <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black via-black/80 to-transparent z-0"></div>
        <div 
            className="absolute -bottom-1/4 left-1/2 -translate-x-1/2 w-[200vw] h-[50vh] bg-primary/20"
            style={{
                background: 'radial-gradient(50% 50% at 50% 100%, hsl(var(--primary) / 0.15) 0%, rgba(255, 255, 255, 0) 100%)'
            }}
        ></div>

      {/* Main Content Area */}
      <div className="z-10 w-full max-w-md">
        <LoginPageClient />
      </div>

       {/* Footer with links */}
      <footer className="absolute bottom-0 left-0 w-full p-4 md:p-8 z-10">
        <div className="w-full max-w-6xl mx-auto">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                {footerLinks.map((link) => (
                    <li key={link.name}>
                        <a 
                            href={link.href} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {link.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
      </footer>

    </div>
  );
}
