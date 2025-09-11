"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { studentsData, type Student } from "@/lib/data";
import { cn } from "@/lib/utils";

interface StudentCardProps {
  student: Student;
  index: number;
}

function StudentCard({ student, index }: StudentCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 50);
    return () => clearTimeout(timer);
  }, [index]);

  const getReadingLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'advanced':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-emerald-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const readingProgress = Math.min((student.booksRead / student.readingGoal) * 100, 100);

  return (
    <div className={cn(
      "transition-all duration-500 transform",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    )}>
      <Link href={`/students/${student.id}`}>
        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden h-full">
          {/* Header with Photo and Basic Info */}
          <div className="relative bg-gradient-to-br from-emerald-100 via-blue-100 to-purple-100 p-6 text-center">
            {/* Achievements Badge */}
            {student.achievements.length > 0 && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
                  {student.achievements.length} 🏆
                </Badge>
              </div>
            )}

            {/* Student Photo */}
            <div className="relative mb-4">
              <img 
                src={student.photoUrl}
                alt={student.name}
                className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/20dc82bf-a638-4da7-bf7d-456dfcb2889f.png}`;
                }}
              />
              {/* Active Reader Indicator */}
              {student.currentlyBorrowed.length > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                  📖
                </div>
              )}
            </div>

            {/* Student Name and Basic Info */}
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
              {student.name}
            </h3>
            <p className="text-gray-600 mb-2">
              {student.classroom} • Age {student.age}
            </p>
            <p className="text-sm text-gray-500">
              Teacher: {student.teacher}
            </p>
          </div>
          
          {/* Content */}
          <CardContent className="p-6 space-y-4">
            {/* Reading Level and Stats */}
            <div className="flex items-center justify-between">
              <Badge className={cn("text-sm font-medium capitalize", getReadingLevelColor(student.readingLevel))}>
                {student.readingLevel} Reader
              </Badge>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">
                  {student.booksRead}
                </div>
                <div className="text-xs text-gray-500">books read</div>
              </div>
            </div>

            {/* Reading Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Reading Goal Progress</span>
                <span className="font-medium text-gray-800">
                  {student.booksRead}/{student.readingGoal}
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-1000 ease-out", getProgressColor(readingProgress))}
                  style={{ width: `${readingProgress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 text-center">
                {Math.round(readingProgress)}% complete
              </div>
            </div>

            {/* Currently Borrowed Books */}
            {student.currentlyBorrowed.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">
                  Currently Reading:
                </div>
                <div className="space-y-1">
                  {student.currentlyBorrowed.slice(0, 2).map((book) => (
                    <div key={book.id} className="text-xs text-gray-600 bg-gray-50 rounded p-2">
                      {book.title}
                    </div>
                  ))}
                  {student.currentlyBorrowed.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{student.currentlyBorrowed.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Favorite Categories */}
            {student.favoriteCategories.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">
                  Favorite Topics:
                </div>
                <div className="flex flex-wrap gap-1">
                  {student.favoriteCategories.slice(0, 3).map((category) => (
                    <Badge 
                      key={category} 
                      variant="outline" 
                      className="text-xs capitalize"
                    >
                      {category.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Join Date */}
            <div className="pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                Member since {new Date(student.joinDate).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [classroomFilter, setClassroomFilter] = useState<string>("all");
  const [readingLevelFilter, setReadingLevelFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let filtered = studentsData.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.teacher.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClassroom = classroomFilter === "all" || student.classroom === classroomFilter;
      const matchesReadingLevel = readingLevelFilter === "all" || student.readingLevel === readingLevelFilter;

      return matchesSearch && matchesClassroom && matchesReadingLevel;
    });

    // Sort students
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "age":
          return a.age - b.age;
        case "booksRead":
          return b.booksRead - a.booksRead;
        case "classroom":
          return a.classroom.localeCompare(b.classroom);
        case "progress":
          const progressA = (a.booksRead / a.readingGoal) * 100;
          const progressB = (b.booksRead / b.readingGoal) * 100;
          return progressB - progressA;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, classroomFilter, readingLevelFilter, sortBy]);

  // Get unique values for filters
  const classrooms = [...new Set(studentsData.map(student => student.classroom))];
  const readingLevels = [...new Set(studentsData.map(student => student.readingLevel))];

  const resetFilters = () => {
    setSearchTerm("");
    setClassroomFilter("all");
    setReadingLevelFilter("all");
    setSortBy("name");
  };

  // Calculate stats
  const totalStudents = studentsData.length;
  const activeReaders = studentsData.filter(s => s.currentlyBorrowed.length > 0).length;
  const averageBooksRead = Math.round(studentsData.reduce((sum, s) => sum + s.booksRead, 0) / totalStudents);
  const topReaders = studentsData.filter(s => s.booksRead >= averageBooksRead).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="text-5xl animate-bounce">👥</div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          Our Amazing Readers
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Meet our wonderful students and track their reading journey
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
        <Card className="p-4 text-center bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="text-2xl font-bold text-emerald-700">{totalStudents}</div>
          <div className="text-sm text-emerald-600">Total Students</div>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="text-2xl font-bold text-blue-700">{activeReaders}</div>
          <div className="text-sm text-blue-600">Active Readers</div>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="text-2xl font-bold text-purple-700">{averageBooksRead}</div>
          <div className="text-sm text-purple-600">Avg Books Read</div>
        </Card>
        <Card className="p-4 text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="text-2xl font-bold text-yellow-700">{topReaders}</div>
          <div className="text-sm text-yellow-600">Top Readers</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 space-y-4 bg-white/80 backdrop-blur-sm border-emerald-100 animate-slide-up">
        {/* Search Bar */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search students by name or teacher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 text-lg border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select value={classroomFilter} onValueChange={setClassroomFilter}>
            <SelectTrigger className="border-emerald-200">
              <SelectValue placeholder="Classroom" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classrooms</SelectItem>
              {classrooms.map(classroom => (
                <SelectItem key={classroom} value={classroom}>
                  {classroom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={readingLevelFilter} onValueChange={setReadingLevelFilter}>
            <SelectTrigger className="border-emerald-200">
              <SelectValue placeholder="Reading Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {readingLevels.map(level => (
                <SelectItem key={level} value={level} className="capitalize">
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="border-emerald-200">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="age">Age</SelectItem>
              <SelectItem value="booksRead">Most Books Read</SelectItem>
              <SelectItem value="classroom">Classroom</SelectItem>
              <SelectItem value="progress">Reading Progress</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={resetFilters}
            variant="outline" 
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-all duration-300"
          >
            Clear Filters
          </Button>
        </div>

        {/* Results Count */}
        <div className="text-lg font-medium text-emerald-600">
          {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
        </div>

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Search: "{searchTerm}"
              <button 
                onClick={() => setSearchTerm("")}
                className="ml-2 hover:text-blue-900"
              >
                ✕
              </button>
            </Badge>
          )}
          {classroomFilter !== "all" && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {classroomFilter}
              <button 
                onClick={() => setClassroomFilter("all")}
                className="ml-2 hover:text-green-900"
              >
                ✕
              </button>
            </Badge>
          )}
          {readingLevelFilter !== "all" && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 capitalize">
              {readingLevelFilter}
              <button 
                onClick={() => setReadingLevelFilter("all")}
                className="ml-2 hover:text-purple-900"
              >
                ✕
              </button>
            </Badge>
          )}
        </div>
      </Card>

      {/* Students Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map((student, index) => (
            <StudentCard key={student.id} student={student} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-4">
          <div className="text-6xl opacity-50">👥</div>
          <h3 className="text-2xl font-semibold text-gray-600">No students found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Try adjusting your search terms or filters to find the students you're looking for.
          </p>
          <Button 
            onClick={resetFilters}
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Add Student Button (for administrators) */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link href="/students/add">
          <Button 
            size="lg"
            className="rounded-full w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 text-2xl"
          >
            +
          </Button>
        </Link>
      </div>
    </div>
  );
}