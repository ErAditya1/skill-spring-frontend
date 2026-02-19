
import { ReactNode } from "react";

// SEO Metadata for Chat Page
export const metadata = {
    title: "Real-time Chat - Skill Spring Learning Platform", // Title for the Chat Page
    description: "Engage in real-time conversations with fellow learners and instructors on Skill Spring. Connect, share, and collaborate instantly!", // Short and SEO-friendly description
    keywords: "real-time chat, messaging, Skill Spring, live chat, learning platform, instant messaging, student communication, online learning", // Keywords specific to chat features and the platform
    author: "Aditya Kumar", // Author meta tag for content attribution
    robots: "index, follow", // Tells search engines to index this page and follow links
  
    // Open Graph (OG) Meta Tags for social media sharing
    og: {
      title: "Real-time Chat - Skill Spring Learning Platform",
      description: "Engage in real-time conversations with fellow learners and instructors on Skill Spring. Connect, share, and collaborate instantly!",
      image: "/skillspringLight.png", // Image for social media preview
      url: "https://skillspring-sigma.vercel.app/chat", // Chat page URL
      type: "website",
    },
  
    // Twitter Meta Tags for Twitter Card optimization
    twitter: {
      card: "summary_large_image", // Card type for Twitter
      title: "Real-time Chat - Skill Spring Learning Platform",
      description: "Engage in real-time conversations with fellow learners and instructors on Skill Spring. Connect, share, and collaborate instantly!",
      image: "/skillspringLight.png", // Image for Twitter sharing
    },
  };

 export default async function ChatLayout({ children }: { children: ReactNode }){
  
  
    return (
      <div className="chat-layout">
        {children}
      </div>
    );
  };
  