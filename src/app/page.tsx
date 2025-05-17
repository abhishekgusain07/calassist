"use client";
import { useState, useEffect } from "react";
import { NavbarDemo } from "@/components/navbar";
import Pricing from "@/components/pricing";
import Image from "next/image";
import Link from "next/link";
import Footer from "./components/footer";
import Announcement from "./components/announcement";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import type { LucideIcon } from "lucide-react";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";
import { useUser } from "@/hooks/useUser";

export default function Home() {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const { user } = useUser();
  const { openFeedbackModal, FeedbackModalComponent } = useFeedbackModal(user?.id);
  
  useEffect(() => {
    // Check if the announcement has been dismissed before
    const announcementDismissed = localStorage.getItem('announcement_dismissed');
    if (!announcementDismissed) {
      setShowAnnouncement(true);
    }
  }, []);
  
  const handleAnnouncementDismiss = () => {
    // Store the dismissal in localStorage so it stays dismissed on refresh
    localStorage.setItem('announcement_dismissed', 'true');
    setShowAnnouncement(false);
  };
  
  const announcement = {
    message: "We value your input! Please",
    link: {
      text: "share your feedback",
      url: "#feedback"
    },
    emoji: "💬"
  };

  // Handler for the announcement link click
  const handleFeedbackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openFeedbackModal();
  };

  // Updated features for calendar assistant
  const features: Array<{
    title: string;
    description: string;
    link: string;
    icon?: LucideIcon;
  }> = [
    {
      title: "Natural Language Scheduling",
      description:
        "Create, modify, and query events using plain English. No more clicking through forms—just type what you want!",
      link: "#nlp",
    },
    {
      title: "Google Calendar Integration",
      description:
        "Securely connect your Google Calendar and manage all your events in one place.",
      link: "#integration",
    },
    {
      title: "Instant Event Creation",
      description:
        "Add events like 'Block next Tuesday 2-3 PM for Dentist' and see them appear instantly.",
      link: "#instant",
    },
    {
      title: "Query Your Schedule",
      description:
        "Ask questions like 'What's planned for tomorrow at 4 PM?' and get instant answers.",
      link: "#query",
    },
    {
      title: "Privacy First",
      description:
        "Your data is yours. We use secure authentication and never share your calendar info.",
      link: "#privacy",
    },
    {
      title: "Works Anywhere",
      description:
        "Access your assistant from any device, anytime.",
      link: "#anywhere",
    },
  ];

  // Sample chat demo block
  const chatDemo = [
    { role: "user", text: "Block next Tuesday 2-3 PM for 'Dentist'" },
    { role: "assistant", text: "Event 'Dentist' created for next Tuesday, 2:00–3:00 PM." },
    { role: "user", text: "What's planned for tomorrow at 4 PM?" },
    { role: "assistant", text: "You have 'Team Sync' scheduled at 4:00 PM tomorrow." },
  ];

  // New concise technology section
  const techStack = [
    { name: "Next.js", logo: "/nextjs.svg" },
    { name: "React", logo: "/react.svg" },
    { name: "Google Calendar API", logo: "/google-calendar.svg" },
    { name: "Neon (Postgres)", logo: "https://res.cloudinary.com/dowiygzq3/image/upload/v1741087611/neon-logomark-dark-color_1_bzq0v2.svg" },
    { name: "Drizzle ORM", logo: "https://res.cloudinary.com/dowiygzq3/image/upload/v1741087634/108468352_rdoifc.png" },
    { name: "Tailwind CSS", logo: "/tailwindcss.svg" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Announcement 
        show={showAnnouncement} 
        message={announcement.message}
        link={announcement.link}
        emoji={announcement.emoji}
        onDismiss={handleAnnouncementDismiss}
        onLinkClick={handleFeedbackClick}
      />
      <NavbarDemo>
        {/* Hero Section */}
        <section className="pt-12 pb-12 px-4 md:px-8 lg:px-16 flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Left: Hero Heading, Description, CTA */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-200 leading-tight">
              Talk to Your Calendar
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-6">
              Connect your Google Calendar and manage your schedule using natural language. Create, modify, and query events just by chatting—no more forms, no more hassle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto justify-center lg:justify-start">
              <Link href="/connect" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-md font-medium text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Connect Google Calendar
              </Link>
              <Link href="#demo" className="bg-secondary text-foreground hover:bg-secondary/80 px-8 py-3 rounded-md font-medium text-lg border border-primary/20 transition-all">
                See Demo
              </Link>
            </div>
          </div>
          {/* Right: Chat Demo */}
          <div className="flex-1 flex justify-center w-full">
            <div className="w-full max-w-xl bg-background border border-muted rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 text-center">How it works</h3>
              <div className="space-y-4">
                {chatDemo.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`rounded-xl px-4 py-2 max-w-[80%] ${msg.role === "user" ? "bg-blue-100 text-blue-900" : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"}`}>
                      <span className="font-medium">{msg.role === "user" ? "You" : "CalAssist"}:</span> {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-4 md:px-8 lg:px-16 bg-secondary/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Why CalAssist?</h2>
            <HoverEffect items={features} />
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 px-4 md:px-8 lg:px-16">
          <Pricing />
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-primary/5">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Take Control of Your Calendar?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Connect your Google Calendar and start managing your schedule with AI-powered natural language.
            </p>
            <Link href="/connect" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-md font-medium inline-block">
              Get Started Free
            </Link>
          </div>
        </section>
        <Footer />
      </NavbarDemo>
      
      {/* Render the feedback modal */}
      <FeedbackModalComponent />
    </div>
  );
}
