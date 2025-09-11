"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { studentsData, transactionsData, type Student } from "@/lib/data";
import { cn } from "@/lib/utils";

interface ReadingProgressCardProps {
  student: Student;
  index: number;
}

function ReadingProgressCard({ student, index }: ReadingProgressCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const readingProgress = Math.min((student.booksRead / student.readingGoal) * 100, 100);
  
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-emerald-500 to-green-500';
    if (progress >= 60) return 'from-blue-500 to-cyan-500';
    if (progress >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-orange-500 to-red-500';
  };

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

  // Get student's reading history from transactions
  const studentTransactions = transactionsData
    .filter(t => t.studentId === student.id && t.status === 'returned')
    .sort((a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime())
    .slice(0, 5);

  const monthlyGoal = Math.ceil(student.readingGoal / 12); // Assuming yearly goal
  const currentMonth = new Date().getMonth();
  const monthlyProgress = Math.min(student.booksRead / (monthlyGoal * (currentMonth + 1)), 1);

  return (
    <Card className={cn(
      "transition-all duration-500 hover:shadow-xl hover:scale-105 cursor-pointer",
      "animate-slide-up"
    )}
    style={{ animationDelay: `${index * 100}ms` }}
    onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <img 
            src={student.photoUrl}
            alt={student.name}
            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b3b186bb-aa5b-4ebf-a3bf-18577329d5e6.png}`;
            }}
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{student.name}</h3>
            <p className="text-gray-600">{student.classroom} • Age {student.age}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={cn("text-xs", getReadingLevelColor(student.readingLevel))}>
                {student.readingLevel} reader
              </Badge>
              <Badge variant="outline" className="text-xs">
                {student.achievements.length} achievements
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-600">
              {student.booksRead}
            </div>
            <div className="text-sm text-gray-500">books read</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3">
          {/* Yearly Goal Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Yearly Goal Progress</span>
              <span className="text-sm text-gray-600">{student.booksRead}/{student.readingGoal}</span>
            </div>
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-1000", getProgressColor(readingProgress))}
                style={{ width: `${readingProgress}%` }}
              />
            </div>
            <div className="text-xs text-center text-gray-500">
              {Math.round(readingProgress)}% Complete
            </div>
          </div>

          {/* Monthly Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Monthly Target</span>
              <span className="text-sm text-gray-600">{monthlyGoal} books/month</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-1000"
                style={{ width: `${Math.min(monthlyProgress * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Currently Reading */}
        {student.currentlyBorrowed.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Currently Reading:</h4>
            <div className="flex flex-wrap gap-2">
              {student.currentlyBorrowed.slice(0, 2).map((book) => (
                <Badge 
                  key={book.id} 
                  variant="secondary" 
                  className="bg-emerald-100 text-emerald-700 text-xs"
                >
                  {book.title}
                </Badge>
              ))}
              {student.currentlyBorrowed.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{student.currentlyBorrowed.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-4 border-t border-gray-200 pt-4 animate-fade-in">
            {/* Achievements */}
            {student.achievements.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Recent Achievements:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {student.achievements.slice(0, 4).map((achievement) => (
                    <div 
                      key={achievement.id}
                      className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200"
                    >
                      <span className="text-lg">{achievement.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-yellow-800 truncate">
                          {achievement.title}
                        </div>
                        <div className="text-xs text-yellow-600">
                          {new Date(achievement.dateEarned).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reading History */}
            {studentTransactions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Recent Reading History:</h4>
                <div className="space-y-1">
                  {studentTransactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="text-xs text-gray-600 bg-gray-50 rounded p-2">
                      <div className="flex justify-between">
                        <span>Book ID: {transaction.bookId}</span>
                        <span>{new Date(transaction.borrowDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Favorite Categories */}
            {student.favoriteCategories.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Favorite Topics:</h4>
                <div className="flex flex-wrap gap-1">
                  {student.favoriteCategories.map((category) => (
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

            {/* Parent Contact */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Parent Contact:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>{student.parentContact.name}</div>
                <div>{student.parentContact.email}</div>
                <div>{student.parentContact.phone}</div>
              </div>
            </div>
          </div>
        )}

        {/* Expand/Collapse Indicator */}
        <div className="text-center pt-2 border-t border-gray-100">
          <div className={cn(
            "text-gray-400 text-xs transition-transform duration-300",
            isExpanded ? "rotate-180" : ""
          )}>
            ▼ {isExpanded ? 'Click to collapse' : 'Click to expand'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReadingLogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [classroomFilter, setClassroomFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("progress");

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let filtered = studentsData.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.teacher.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClassroom = classroomFilter === "all" || student.classroom === classroomFilter;

      return matchesSearch && matchesClassroom;
    });

    // Sort students
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "progress":
          const progressA = (a.booksRead / a.readingGoal) * 100;
          const progressB = (b.booksRead / b.readingGoal) * 100;
          return progressB - progressA;
        case "booksRead":
          return b.booksRead - a.booksRead;
        case "name":
          return a.name.localeCompare(b.name);
        case "classroom":
          return a.classroom.localeCompare(b.classroom);
        case "achievements":
          return b.achievements.length - a.achievements.length;
        default:
          return b.booksRead - a.booksRead;
      }
    });

    return filtered;
  }, [searchTerm, classroomFilter, sortBy]);

  // Get unique classrooms
  const classrooms = [...new Set(studentsData.map(student => student.classroom))];

  const resetFilters = () => {
    setSearchTerm("");
    setClassroomFilter("all");
    setSortBy("progress");
  };

  // Calculate overall stats
  const totalBooksRead = studentsData.reduce((sum, student) => sum + student.booksRead, 0);
  const averageProgress = Math.round(
    studentsData.reduce((sum, student) => sum + (student.booksRead / student.readingGoal) * 100, 0) / studentsData.length
  );
  const topReaders = studentsData.filter(s => (s.booksRead / s.readingGoal) >= 0.8).length;
  const totalAchievements = studentsData.reduce((sum, student) => sum + student.achievements.length, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="text-5xl animate-bounce">📊</div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          Reading Progress Tracker
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Monitor student reading progress, achievements, and goals
        </p>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
        <Card className="p-6 text-center bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="text-3xl font-bold text-emerald-700">{totalBooksRead}</div>
          <div className="text-sm text-emerald-600 mt-1">Total Books Read</div>
        </Card>
        
        <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="text-3xl font-bold text-blue-700">{averageProgress}%</div>
          <div className="text-sm text-blue-600 mt-1">Average Progress</div>
        </Card>
        
        <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="text-3xl font-bold text-purple-700">{topReaders}</div>
          <div className="text-sm text-purple-600 mt-1">Goal Achievers</div>
        </Card>
        
        <Card className="p-6 text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="text-3xl font-bold text-yellow-700">{totalAchievements}</div>
          <div className="text-sm text-yellow-600 mt-1">Total Achievements</div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="border-emerald-200">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="progress">Reading Progress</SelectItem>
              <SelectItem value="booksRead">Books Read</SelectItem>
              <SelectItem value="achievements">Achievements</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="classroom">Classroom</SelectItem>
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
          Tracking {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
        </div>
      </Card>

      {/* Students Progress Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredStudents.map((student, index) => (
            <ReadingProgressCard key={student.id} student={student} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-4">
          <div className="text-6xl opacity-50">📊</div>
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

      {/* Export Button */}
      <div className="text-center">
        <Button 
          size="lg"
          variant="outline"
          className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
        >
          📄 Export Progress Report
        </Button>
      </div>
    </div>
  );
}