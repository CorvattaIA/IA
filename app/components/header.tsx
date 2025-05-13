"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Brain, TestTube, MessageSquare } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  
  const handleScroll = () => {
    const homeSection = document.getElementById("home");
    const testSection = document.getElementById("test");
    const chatSection = document.getElementById("chat");
    
    const scrollPosition = window.scrollY + 100;
    
    if (window.scrollY > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
    
    if (homeSection && scrollPosition < homeSection.offsetTop + homeSection.offsetHeight) {
      setActiveSection("home");
    } else if (testSection && scrollPosition < testSection.offsetTop + testSection.offsetHeight) {
      setActiveSection("test");
    } else if (chatSection) {
      setActiveSection("chat");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      });
      setIsOpen(false);
    }
  };

  const navItems = [
    { id: "home", label: "Inicio", icon: <Brain className="w-4 h-4 mr-2" /> },
    { id: "test", label: "Diagnóstico", icon: <TestTube className="w-4 h-4 mr-2" /> },
    { id: "chat", label: "Chat", icon: <MessageSquare className="w-4 h-4 mr-2" /> },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
      scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : ""
    }`}>
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-bold flex items-center"
          >
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="hidden sm:inline">ética IA</span>
          </motion.div>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item.id)}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                {item.icon}
                {item.label}
              </motion.button>
            ))}
          </nav>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 md:hidden rounded-md hover:bg-accent"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-background border-t border-border"
        >
          <div className="container py-4 space-y-2">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection(item.id)}
                className={`flex items-center w-full px-4 py-3 rounded-md transition-colors ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                {item.icon}
                {item.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;