"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { booksData, studentsData, borrowBook, getAvailableBooks, type Book, type Student } from "@/lib/data";
import { cn } from "@/lib/utils";

interface CheckoutStepProps {
  step: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

function CheckoutStep({ step, title, isActive, isCompleted }: CheckoutStepProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-lg transition-all duration-300",
      isActive ? "bg-emerald-100 border-2 border-emerald-300" :
      isCompleted ? "bg-emerald-50 border-2 border-emerald-200" :
      "bg-gray-50 border-2 border-gray-200"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300",
        isCompleted ? "bg-emerald-500 text-white" :
        isActive ? "bg-emerald-400 text-white animate-pulse" :
        "bg-gray-300 text-gray-600"
      )}>
        {isCompleted ? "✓" : step}
      </div>
      <span className={cn(
        "font-medium transition-colors duration-300",
        isActive ? "text-emerald-800" :
        isCompleted ? "text-emerald-700" :
        "text-gray-600"
      )}>
        {title}
      </span>
    </div>
  );
}

interface StudentCardProps {
  student: Student;
  onSelect: (student: Student) => void;
  isSelected: boolean;
}

function StudentCard({ student, onSelect, isSelected }: StudentCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105",
        isSelected ? "ring-2 ring-emerald-400 bg-emerald-50 border-emerald-300" : "hover:border-emerald-200"
      )}
      onClick={() => onSelect(student)}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <img 
          src={student.photoUrl}
          alt={student.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/8486e136-5661-4126-8cdf-02a44a1b5cda.png}`;
          }}
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{student.name}</h3>
          <p className="text-sm text-gray-600">{student.classroom} • Age {student.age}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs capitalize">
              {student.readingLevel} Reader
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {student.booksRead} books read
            </Badge>
          </div>
        </div>
        {student.currentlyBorrowed.length > 0 && (
          <div className="text-sm text-emerald-600 font-medium">
            {student.currentlyBorrowed.length} book{student.currentlyBorrowed.length !== 1 ? 's' : ''} checked out
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
  isSelected: boolean;
}

function BookCard({ book, onSelect, isSelected }: BookCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'practical-life':
        return 'bg-green-100 text-green-800';
      case 'sensorial':
        return 'bg-purple-100 text-purple-800';
      case 'language':
        return 'bg-blue-100 text-blue-800';
      case 'mathematics':
        return 'bg-red-100 text-red-800';
      case 'cultural':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105",
        isSelected ? "ring-2 ring-emerald-400 bg-emerald-50 border-emerald-300" : "hover:border-emerald-200"
      )}
      onClick={() => onSelect(book)}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-16 h-20 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a67c58ea-fd82-4240-8883-40b12d658086.png}`;
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 truncate">{book.title}</h3>
          <p className="text-sm text-gray-600 truncate">by {book.author}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={cn("text-xs", getCategoryColor(book.category))}>
              {book.category.replace('-', ' ')}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {book.ageGroup}
            </Badge>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-sm font-medium text-emerald-600">
            {book.availableCopies} available
          </div>
          <div className="text-xs text-gray-500">
            of {book.totalCopies} total
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const preSelectedBookId = searchParams.get('bookId');

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");
  const [classroomFilter, setClassroomFilter] = useState<string>("all");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Pre-select book if provided in URL
  useEffect(() => {
    if (preSelectedBookId) {
      const book = booksData.find(b => b.id === preSelectedBookId && b.status === 'available' && b.availableCopies > 0);
      if (book) {
        setSelectedBook(book);
        setCurrentStep(2);
      }
    }
  }, [preSelectedBookId]);

  // Get available books
  const availableBooks = useMemo(() => {
    return getAvailableBooks().filter(book => 
      book.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
      book.author.toLowerCase().includes(bookSearch.toLowerCase())
    );
  }, [bookSearch]);

  // Filter students
  const filteredStudents = useMemo(() => {
    return studentsData.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(studentSearch.toLowerCase());
      const matchesClassroom = classroomFilter === "all" || student.classroom === classroomFilter;
      return matchesSearch && matchesClassroom;
    });
  }, [studentSearch, classroomFilter]);

  // Get unique classrooms
  const classrooms = [...new Set(studentsData.map(student => student.classroom))];

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setCurrentStep(2);
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setCurrentStep(3);
  };

  const handleCheckout = async () => {
    if (!selectedBook || !selectedStudent) return;

    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const transaction = borrowBook(selectedBook.id, selectedStudent.id);
    
    if (transaction) {
      setSuccessMessage(`Successfully checked out "${selectedBook.title}" to ${selectedStudent.name}!`);
      setShowSuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedBook(null);
        setSelectedStudent(null);
        setCurrentStep(1);
        setBookSearch("");
        setStudentSearch("");
        setClassroomFilter("all");
      }, 3000);
    }
    
    setIsProcessing(false);
  };

  const resetCheckout = () => {
    setSelectedBook(null);
    setSelectedStudent(null);
    setCurrentStep(1);
    setBookSearch("");
    setStudentSearch("");
    setClassroomFilter("all");
    setShowSuccess(false);
  };

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="text-8xl animate-bounce">🎉</div>
          <h1 className="text-4xl font-bold text-emerald-600">Checkout Successful!</h1>
          <p className="text-xl text-gray-700 max-w-md mx-auto">
            {successMessage}
          </p>
          <div className="text-lg text-gray-600">
            Due date: {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </div>
          <Button 
            onClick={resetCheckout}
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
          >
            Checkout Another Book
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="text-5xl animate-bounce">📤</div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          Book Checkout
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Help students borrow their favorite books with our simple checkout process
        </p>
      </div>

      {/* Progress Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
        <CheckoutStep 
          step={1} 
          title="Select a Book" 
          isActive={currentStep === 1} 
          isCompleted={currentStep > 1} 
        />
        <CheckoutStep 
          step={2} 
          title="Choose Student" 
          isActive={currentStep === 2} 
          isCompleted={currentStep > 2} 
        />
        <CheckoutStep 
          step={3} 
          title="Confirm Checkout" 
          isActive={currentStep === 3} 
          isCompleted={false} 
        />
      </div>

      {/* Step 1: Select Book */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fade-in">
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-2xl text-gray-800">Step 1: Select a Book</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <Input
                type="text"
                placeholder="Search books by title or author..."
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                className="text-lg border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
              />
              
              <div className="text-sm text-gray-600">
                {availableBooks.length} book{availableBooks.length !== 1 ? 's' : ''} available
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableBooks.map(book => (
              <BookCard 
                key={book.id} 
                book={book} 
                onSelect={handleBookSelect}
                isSelected={false}
              />
            ))}
          </div>

          {availableBooks.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="text-6xl opacity-50">📚</div>
              <h3 className="text-2xl font-semibold text-gray-600">No books available</h3>
              <p className="text-gray-500">
                {bookSearch ? "Try a different search term." : "All books are currently checked out."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select Student */}
      {currentStep === 2 && selectedBook && (
        <div className="space-y-6 animate-fade-in">
          {/* Selected Book Summary */}
          <Card className="p-6 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-20 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-lg overflow-hidden">
                <img 
                  src={selectedBook.coverImage}
                  alt={selectedBook.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{selectedBook.title}</h3>
                <p className="text-gray-600">by {selectedBook.author}</p>
                <Badge className="mt-2 bg-emerald-100 text-emerald-700">
                  Selected for Checkout
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setCurrentStep(1)}
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              >
                Change Book
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-2xl text-gray-800">Step 2: Choose Student</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Search students by name..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="flex-1 text-lg border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                />
                <Select value={classroomFilter} onValueChange={setClassroomFilter}>
                  <SelectTrigger className="w-48 border-emerald-200">
                    <SelectValue placeholder="Filter by classroom" />
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
              </div>
              
              <div className="text-sm text-gray-600">
                {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.map(student => (
              <StudentCard 
                key={student.id} 
                student={student} 
                onSelect={handleStudentSelect}
                isSelected={false}
              />
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="text-6xl opacity-50">👥</div>
              <h3 className="text-2xl font-semibold text-gray-600">No students found</h3>
              <p className="text-gray-500">
                Try adjusting your search terms or filters.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Confirm Checkout */}
      {currentStep === 3 && selectedBook && selectedStudent && (
        <div className="space-y-6 animate-fade-in">
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-2xl text-gray-800">Step 3: Confirm Checkout</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              {/* Checkout Summary */}
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Checkout Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Book Info */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Book</h4>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <img 
                        src={selectedBook.coverImage}
                        alt={selectedBook.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{selectedBook.title}</div>
                        <div className="text-sm text-gray-600">by {selectedBook.author}</div>
                        <div className="text-xs text-gray-500">{selectedBook.location}</div>
                      </div>
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Student</h4>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <img 
                        src={selectedStudent.photoUrl}
                        alt={selectedStudent.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{selectedStudent.name}</div>
                        <div className="text-sm text-gray-600">{selectedStudent.classroom}</div>
                        <div className="text-xs text-gray-500">Age {selectedStudent.age}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout Details */}
                <div className="border-t border-emerald-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Checkout Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium text-emerald-600">
                      {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Loan Period:</span>
                    <span className="font-medium">14 days</span>
                  </div>
                </div>
              </div>

              {/* Student Current Books */}
              {selectedStudent.currentlyBorrowed.length > 0 && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertDescription className="text-orange-700">
                    <strong>{selectedStudent.name}</strong> currently has <strong>{selectedStudent.currentlyBorrowed.length}</strong> book{selectedStudent.currentlyBorrowed.length !== 1 ? 's' : ''} checked out.
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold py-3 rounded-xl transition-all duration-300"
                >
                  Back to Student Selection
                </Button>
                <Button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    "Complete Checkout"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}