
import { Inter } from "next/font/google";
import "./globals.css";
import { CssVarsProvider } from "@mui/joy/styles";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster";
import { SocketProvider } from "@/context/SocketContext";

import UserContext from "@/context/UserContext";
import { Providers } from "./providers";
import DynamicFavicon from "@/components/DynamicFavicon";




const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://skillspring-sigma.vercel.app"),
  title: {
    default: "Skill Spring | Online Learning Platform",
    template: "%s | Skill Spring",
  },
  description:
    "Join Skill Spring, the leading online learning platform offering diverse courses in technology, business, and personal development.",
  keywords: [
    "online learning",
    "Skill Spring",
    "skill development",
    "career growth",
    "tech courses",
    "business courses",
  ],
  authors: [{ name: "Aditya Kumar" }],
  openGraph: {
    title: "Skill Spring | Online Learning Platform",
    description:
      "Enhance your skills, advance your career, and learn at your own pace.",
    url: "https://skillspring-sigma.vercel.app",
    siteName: "Skill Spring",
    images: [
      {
        url: "/skillspringLight.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skill Spring | Online Learning Platform",
    description:
      "Enhance your skills, advance your career, and learn at your own pace.",
    images: ["/skillspringLight.png"],
  },
  icons: {
    icon: [
      { url: "/skillspringLight.png", media: "(prefers-color-scheme: light)" },
      { url: "/skillspringDark.png", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: "/skillspringLight.png",
    apple: "/skillspringLight.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html lang="en" className="" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Join Skill Spring, the leading online learning platform offering diverse courses in technology, business, and personal development. Enhance your skills, advance your career, and learn at your own pace."
        />
        <meta
          name="keywords"
          content="online learning, Skill Spring, online courses, skill development, career growth, professional development, learn online, education platform, tech courses, business courses, personal development"
        />
        <meta name="author" content="Skill Spring" />
        <meta
          property="og:title"
          content="Skill Spring: Online Learning Platform for Skill Development & Career Growth"
        />
        <meta
          property="og:description"
          content="Join Skill Spring, the leading online learning platform offering diverse courses in technology, business, and personal development. Enhance your skills, advance your career, and learn at your own pace."
        />
        <meta property="og:image" content="/skillspringLight.png" /> {/* Optional image for social sharing */}
        <meta property="og:url" content="https://skillspring-sigma.vercel.app" />
        <meta name="twitter:card" content="/skillspringLight.png" />
        <meta
          name="twitter:title"
          content="Skill Spring: Online Learning Platform for Skill Development & Career Growth"
        />
        <meta
          name="twitter:description"
          content="Join Skill Spring, the leading online learning platform offering diverse courses in technology, business, and personal development. Enhance your skills, advance your career, and learn at your own pace."
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-KFBC9X698J"
        ></script>
        <meta name="google-site-verification" content="Bvx3h17BfA-g1xTam6S2n0v6-sc1GTKNDoA6Uo2EyTU" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-KFBC9X698J');
              `,
          }}
        />

        <meta name="twitter:image" content="/skillspringLight.png" /> {/* Optional image for Twitter */}
      </head>
      <Providers>
        <body className={inter.className}>

          <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SocketProvider>
                <UserContext>
                  <DynamicFavicon />


                  {children}
                </UserContext>
              </SocketProvider>

            </ThemeProvider>
          </CssVarsProvider>

          <Toaster />

        </body>
      </Providers>



    </html >


  );
}
