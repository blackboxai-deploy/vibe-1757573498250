"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { studentsData, transactionsData, returnBook, type Student, type Book } from "@/lib/data";
import { cn } from "@/lib/utils";

interface BorrowedBookItemProps {
  student: Student;
  book: Book;
  dueDate: Date;
  isOverdue: boolean;
  onReturn: () => void;
  isProcessing: boolean;
}

function BorrowedBookItem({ student, book, dueDate, isOverdue, onReturn, isProcessing }: BorrowedBookItemProps) {
  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg",
      isOverdue ? "border-red-300 bg-red-50" : "hover:border-emerald-200"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Book Cover */}
          <div className="w-16 h-20 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c98b1112-6fc0-434b-b2f8-b0b9eb30f1de.png}`;
              }}
            />
          </div>

          {/* Book and Student Info */}
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{book.title}</h3>
              <p className="text-gray-600">by {book.author}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img 
                  src={student.photoUrl}
                  alt={student.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/10ada96d-2698-4237-b922-cbb6c1d410f7.png}`;
                  }}
                />
                <div>
                  <div className="font-medium text-gray-900 text-sm">{student.name}</div>
                  <div className="text-xs text-gray-500">{student.classroom}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="text-gray-600">
                Due: {dueDate.toLocaleDateString()}
              </div>
              {isOverdue && (
                <Badge className="bg-red-100 text-red-700 border-red-200">
                  {Math.ceil((Date.now() - dueDate.getTime()) / (1000 * 60 * 60 * 24))} days overdue
                </Badge>
              )}
            </div>
          </div>

          {/* Return Button */}
          <div className="flex-shrink-0">
            <Button 
              onClick={onReturn}
              disabled={isProcessing}
              className={cn(
                "transition-all duration-300 hover:scale-105",
                isOverdue 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
              )}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Returning...
                </div>
              ) : (
                "Return Book"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ReturnSuccessProps {
  book: Book;
  student: Student;
  onContinue: () => void;
}

function ReturnSuccess({ book, student, onContinue }: ReturnSuccessProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <Card className="max-w-md w-full mx-4 animate-scale-in">
        <CardContent className="p-8 text-center space-y-6">
          <div className="text-6xl animate-bounce">🎉</div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-emerald-600">Return Successful!</h2>
            <p className="text-gray-700">
              <strong>"{book.title}"</strong> has been successfully returned by <strong>{student.name}</strong>.
            </p>
          </div>

          <div className="bg-emerald-50 rounded-lg p-4 space-y-2">
            <div className="text-sm text-emerald-700">
              <strong>Book:</strong> {book.title}
            </div>
            <div className="text-sm text-emerald-700">
              <strong>Student:</strong> {student.name} ({student.classroom})
            </div>
            <div className="text-sm text-emerald-700">
              <strong>Returned on:</strong> {new Date().toLocaleDateString()}
            </div>
          </div>

          <Button 
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105"
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ReturnPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [processingReturns, setProcessingReturns] = useState<Set<string>>(new Set());
  const [showSuccess, setShowSuccess] = useState<{book: Book, student: Student} | null>(null);

  // Get all active transactions with book and student info
  const activeBorrows = useMemo(() => {
    const active = transactionsData
      .filter(transaction => transaction.status === 'active')
      .map(transaction => {
        const student = studentsData.find(s => s.id === transaction.studentId);
        const book = student?.currentlyBorrowed.find(b => b.id === transaction.bookId);
        
        if (student && book) {
          const isOverdue = transaction.dueDate < new Date();
          return {
            transaction,
            student,
            book,
            dueDate: transaction.dueDate,
            isOverdue
          };
        }
        return null;
      })
      .filter(Boolean);

    // Filter by search term
    if (searchTerm) {
      return active.filter(item => 
        item && (
          item.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.student.classroom.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return active;
  }, [searchTerm]);

  // Sort by overdue first, then by due date
  const sortedBorrows = useMemo(() => {
    return [...activeBorrows].sort((a, b) => {
      if (!a || !b) return 0;
      
      // Overdue items first
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      
      // Then sort by due date (earliest first)
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  }, [activeBorrows]);

  const handleReturn = async (transactionId: string, book: Book, student: Student) => {
    setProcessingReturns(prev => new Set(prev).add(transactionId));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const success = returnBook(transactionId);
    
    if (success) {
      setShowSuccess({ book, student });
      // Update student's books read count was handled in returnBook function
    }
    
    setProcessingReturns(prev => {
      const newSet = new Set(prev);
      newSet.delete(transactionId);
      return newSet;
    });
  };

  const handleSuccessContinue = () => {
    setShowSuccess(null);
  };

  const overdueCount = sortedBorrows.filter(item => item?.isOverdue).length;
  const totalActiveBooks = sortedBorrows.length;

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="text-5xl animate-bounce">📥</div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Return Books
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Process book returns quickly and easily
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <Card className="p-6 text-center bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <div className="text-3xl font-bold text-emerald-700">{totalActiveBooks}</div>
            <div className="text-sm text-emerald-600 mt-1">Books Checked Out</div>
          </Card>
          
          <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="text-3xl font-bold text-blue-700">{totalActiveBooks - overdueCount}</div>
            <div className="text-sm text-blue-600 mt-1">On Time Returns</div>
          </Card>
          
          <Card className={cn(
            "p-6 text-center",
            overdueCount > 0 
              ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200" 
              : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
          )}>
            <div className={cn(
              "text-3xl font-bold",
              overdueCount > 0 ? "text-red-700" : "text-gray-700"
            )}>
              {overdueCount}
            </div>
            <div className={cn(
              "text-sm mt-1",
              overdueCount > 0 ? "text-red-600" : "text-gray-600"
            )}>
              Overdue Books
            </div>
          </Card>
        </div>

        {/* Search and Alerts */}
        <div className="space-y-4">
          {/* Overdue Alert */}
          {overdueCount > 0 && (
            <Alert className="border-red-200 bg-red-50 animate-slide-up">
              <AlertDescription className="text-red-700">
                <strong>Attention:</strong> There are <strong>{overdueCount}</strong> overdue book{overdueCount !== 1 ? 's' : ''} that need immediate attention.
              </AlertDescription>
            </Alert>
          )}

          {/* Search Bar */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-emerald-100">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by student name, book title, author, or classroom..."
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
            
            {searchTerm && (
              <div className="mt-3 text-sm text-gray-600">
                Found {sortedBorrows.length} book{sortedBorrows.length !== 1 ? 's' : ''} matching "{searchTerm}"
              </div>
            )}
          </Card>
        </div>

        {/* Borrowed Books List */}
        {sortedBorrows.length > 0 ? (
          <div className="space-y-4">
            {overdueCount > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2">
                  🚨 Overdue Books ({overdueCount})
                </h2>
                {sortedBorrows
                  .filter(item => item?.isOverdue)
                  .map((item) => {
                    if (!item) return null;
                    const isProcessing = processingReturns.has(item.transaction.id);
                    return (
                      <BorrowedBookItem
                        key={item.transaction.id}
                        student={item.student}
                        book={item.book}
                        dueDate={item.dueDate}
                        isOverdue={item.isOverdue}
                        onReturn={() => handleReturn(item.transaction.id, item.book, item.student)}
                        isProcessing={isProcessing}
                      />
                    );
                  })}
              </div>
            )}
            
            {totalActiveBooks > overdueCount && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  📚 Current Borrowers ({totalActiveBooks - overdueCount})
                </h2>
                {sortedBorrows
                  .filter(item => item && !item.isOverdue)
                  .map((item) => {
                    if (!item) return null;
                    const isProcessing = processingReturns.has(item.transaction.id);
                    return (
                      <BorrowedBookItem
                        key={item.transaction.id}
                        student={item.student}
                        book={item.book}
                        dueDate={item.dueDate}
                        isOverdue={item.isOverdue}
                        onReturn={() => handleReturn(item.transaction.id, item.book, item.student)}
                        isProcessing={isProcessing}
                      />
                    );
                  })}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            {searchTerm ? (
              <>
                <div className="text-6xl opacity-50">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-600">No matches found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  No books match your search criteria. Try adjusting your search terms.
                </p>
                <Button 
                  onClick={() => setSearchTerm("")}
                  variant="outline"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <div className="text-6xl opacity-50">🎉</div>
                <h3 className="text-2xl font-semibold text-gray-600">All books are returned!</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Great job! There are currently no books checked out that need to be returned.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <ReturnSuccess 
          book={showSuccess.book}
          student={showSuccess.student}
          onContinue={handleSuccessContinue}
        />
      )}
    </>
  );
}