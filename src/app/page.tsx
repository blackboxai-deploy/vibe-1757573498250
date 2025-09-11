"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { libraryStats, getAvailableBooks } from "@/lib/data";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  description: string;
  color: string;
  delay: number;
}

function StatCard({ title, value, icon, description, color, delay }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isVisible && typeof value === 'number') {
      let start = 0;
      const end = value;
      const duration = 1000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setAnimatedValue(end);
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    } else if (typeof value === 'string') {
      setAnimatedValue(0);
    }
  }, [isVisible, value]);

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-105",
      "border-2 border-transparent hover:border-opacity-30",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
      color
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-700">
            {title}
          </CardTitle>
          <div className="text-3xl animate-pulse">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-gray-900">
            {typeof value === 'number' ? animatedValue : value}
          </div>
          <p className="text-sm text-gray-600">
            {description}
          </p>
        </div>
        
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
      </CardContent>
    </Card>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  delay: number;
}

function QuickActionCard({ title, description, icon, href, color, delay }: QuickActionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Link href={href}>
      <Card className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105",
        "border-2 border-transparent hover:border-opacity-50 h-full",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        color
      )}>
        <CardContent className="p-6 text-center space-y-4">
          <div className="text-4xl group-hover:scale-110 transition-transform duration-300 group-hover:animate-bounce">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function HomePage() {
  const availableBooks = getAvailableBooks();
  const totalAvailableBooks = availableBooks.length;
  
  const stats = [
    {
      title: "Total Books",
      value: libraryStats.totalBooks,
      icon: "📚",
      description: "Books in our collection",
      color: "hover:border-blue-300 hover:bg-blue-50",
      delay: 100
    },
    {
      title: "Available Books", 
      value: totalAvailableBooks,
      icon: "✅",
      description: "Ready to borrow",
      color: "hover:border-emerald-300 hover:bg-emerald-50",
      delay: 200
    },
    {
      title: "Students",
      value: libraryStats.totalStudents,
      icon: "👥",
      description: "Registered readers",
      color: "hover:border-purple-300 hover:bg-purple-50",
      delay: 300
    },
    {
      title: "Books Checked Out",
      value: libraryStats.booksCheckedOut,
      icon: "📤",
      description: "Currently borrowed",
      color: "hover:border-orange-300 hover:bg-orange-50", 
      delay: 400
    }
  ];

  const quickActions = [
    {
      title: "Browse Books",
      description: "Explore our collection of wonderful books",
      icon: "🔍",
      href: "/books",
      color: "hover:border-blue-300 hover:bg-blue-50",
      delay: 500
    },
    {
      title: "Checkout Books",
      description: "Help students borrow their favorite books", 
      icon: "📤",
      href: "/checkout",
      color: "hover:border-emerald-300 hover:bg-emerald-50",
      delay: 600
    },
    {
      title: "Return Books",
      description: "Process book returns quickly and easily",
      icon: "📥",
      href: "/return", 
      color: "hover:border-purple-300 hover:bg-purple-50",
      delay: 700
    },
    {
      title: "View Students",
      description: "Check student profiles and reading progress",
      icon: "👥",
      href: "/students",
      color: "hover:border-pink-300 hover:bg-pink-50",
      delay: 800
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="text-6xl animate-bounce">📚</div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to Our Library
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A magical place where young minds discover the joy of reading and learning through exploration
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Quick Actions
          </h2>
          <p className="text-gray-600">
            Choose what you'd like to do today
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <QuickActionCard key={action.title} {...action} />
          ))}
        </div>
      </div>

      {/* Popular Books Section */}
      <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '900ms' }}>
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Popular Books
          </h2>
          <p className="text-gray-600">
            Most loved by our students
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {libraryStats.popularBooks.slice(0, 3).map((book) => (
            <Link key={book.id} href={`/books/${book.id}`}>
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-emerald-100 to-blue-100 relative overflow-hidden">
                  <img 
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                     onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/025d4d1d-2d70-4b6d-9b53-057269c09353.png}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-bold text-lg group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    by {book.author}
                  </p>
                  <div className="flex gap-2">
                    <Badge 
                      variant="secondary" 
                      className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                    >
                      {book.ageGroup}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className="capitalize"
                    >
                      {book.category.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center">
          <Link href="/books">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              View All Books →
            </Button>
          </Link>
        </div>
      </div>

      {/* Active Readers Section */}
      <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Our Amazing Readers
          </h2>
          <p className="text-gray-600">
            Students making great progress
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {libraryStats.activeReaders.slice(0, 3).map((student) => (
            <Link key={student.id} href={`/students/${student.id}`}>
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="relative">
                    <img 
                      src={student.photoUrl}
                      alt={student.name}
                      className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white shadow-lg group-hover:border-emerald-200 transition-colors"
                       onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/062963cb-3378-4c10-b141-c3a1e796d831.png}`;
                      }}
                    />
                    <div className="absolute -top-1 -right-1 text-2xl animate-bounce">
                      🌟
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {student.classroom} • Age {student.age}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-emerald-600">
                      {student.booksRead}
                    </div>
                    <p className="text-sm text-gray-600">
                      Books Read
                    </p>
                  </div>
                  
                  <Badge className="bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 border-emerald-200">
                    {student.readingLevel} reader
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center">
          <Link href="/students">
            <Button 
              variant="outline" 
              size="lg"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              View All Students →
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Reading Progress */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 text-center space-y-4 animate-fade-in-up" style={{ animationDelay: '1100ms' }}>
        <div className="text-4xl animate-pulse">🎯</div>
        <h2 className="text-2xl font-bold text-gray-800">
          Monthly Reading Goal Progress
        </h2>
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-full h-4 shadow-inner overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${libraryStats.monthlyReadingGoalProgress}%` }}
            />
          </div>
          <div className="mt-2 text-lg font-semibold text-gray-700">
            {libraryStats.monthlyReadingGoalProgress}% Complete
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Great job everyone! Keep up the amazing reading!
          </p>
        </div>
      </div>
    </div>
  );
}