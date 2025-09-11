"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface NavigationItem {
  href: string;
  label: string;
  icon: string;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    href: "/",
    label: "Home",
    icon: "🏠",
    description: "Library Dashboard"
  },
  {
    href: "/books",
    label: "Books",
    icon: "📚",
    description: "Browse Catalog"
  },
  {
    href: "/students",
    label: "Students",
    icon: "👥",
    description: "Manage Students"
  },
  {
    href: "/checkout",
    label: "Checkout",
    icon: "📤",
    description: "Borrow Books"
  },
  {
    href: "/return",
    label: "Return",
    icon: "📥",
    description: "Return Books"
  },
  {
    href: "/reading-log",
    label: "Reading Log",
    icon: "📊",
    description: "Track Progress"
  }
];

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "sticky top-0 z-50 bg-white border-b border-emerald-100 transition-all duration-300",
      isScrolled ? "shadow-lg backdrop-blur-md bg-white/90" : "shadow-sm"
    )}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group"
          >
            <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
              📚
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Montessori Library
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Learning Through Discovery</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                    "hover:bg-emerald-50 hover:text-emerald-700 hover:scale-105",
                    "flex flex-col items-center gap-1 min-w-[80px] group",
                    isActive
                      ? "bg-emerald-100 text-emerald-700 shadow-sm"
                      : "text-gray-600 hover:text-emerald-700"
                  )}
                >
                  <span className="text-lg group-hover:animate-bounce">
                    {item.icon}
                  </span>
                  <span className="text-xs">{item.label}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-emerald-50 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <div className={cn(
              "w-6 h-6 flex flex-col justify-center items-center transition-all duration-300",
              isMobileMenuOpen && "rotate-90"
            )}>
              <div className={cn(
                "w-5 h-0.5 bg-gray-600 transition-all duration-300",
                isMobileMenuOpen ? "rotate-45 translate-y-1.5" : "mb-1"
              )} />
              <div className={cn(
                "w-5 h-0.5 bg-gray-600 transition-all duration-300",
                isMobileMenuOpen ? "opacity-0" : "mb-1"
              )} />
              <div className={cn(
                "w-5 h-0.5 bg-gray-600 transition-all duration-300",
                isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              )} />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isMobileMenuOpen 
            ? "max-h-96 pb-6" 
            : "max-h-0"
        )}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
            {navigationItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "relative p-4 rounded-xl text-center transition-all duration-300",
                    "border-2 border-transparent hover:border-emerald-200",
                    "transform hover:scale-105 active:scale-95",
                    isActive
                      ? "bg-gradient-to-br from-emerald-100 to-blue-100 text-emerald-700 border-emerald-200"
                      : "bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 shadow-sm"
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <div className={cn(
                    "text-2xl mb-2 transition-transform duration-300",
                    isActive && "animate-bounce"
                  )}>
                    {item.icon}
                  </div>
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs opacity-70 mt-1">{item.description}</div>
                  
                  {/* Active indicator for mobile */}
                  {isActive && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-[-1] animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}