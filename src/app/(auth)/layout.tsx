import { Globe, Briefcase, Linkedin, Youtube, Shield, Facebook } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const footerLinks = [
    { name: "Site", href: "https://brsupply.com.br/", icon: Globe },
    { name: "Supply Manager", href: "#", icon: Briefcase },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/brsupply-suprimentos-corporativos/posts/?feedView=all", icon: Linkedin },
    { name: "Youtube", href: "https://www.youtube.com/@brsupplysuprimentos", icon: Youtube },
    { name: "Facebook", href: "https://www.facebook.com/brsupply.suprimentos.corporativos", icon: Facebook },
    { name: "Contato Seguro", href: "https://www.brsupply.com.br/canal-etico/", icon: Shield },
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
          <img
              src="/br-supply-logo.png"
              alt="BRS Academy Logo"
              className="h-28"
              data-ai-hint="logo"
          />
      </header>

      {/* Main Content Area */}
      <main className="z-10 w-full flex flex-1 flex-col items-center justify-center">
        {children}
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
  )
}
