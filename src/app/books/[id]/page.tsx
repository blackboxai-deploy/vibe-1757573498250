"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBookById, studentsData, transactionsData, type Book } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function BookDetailPage() {
  const params = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (params?.id) {
      const bookId = Array.isArray(params.id) ? params.id[0] : params.id;
      const foundBook = getBookById(bookId);
      setBook(foundBook || null);
      setIsLoading(false);
    }
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-spin">📚</div>
          <p className="text-lg text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center space-y-6 py-12">
        <div className="text-6xl opacity-50">📚</div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Book Not Found</h1>
          <p className="text-gray-600">Sorry, we couldn't find the book you're looking for.</p>
        </div>
        <Link href="/books">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
          >
            ← Back to Books
          </Button>
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'borrowed':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'reserved':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'maintenance':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

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

  // Get current borrowers
  const currentBorrowers = book.borrowedBy?.map(studentId => 
    studentsData.find(student => student.id === studentId)
  ).filter(Boolean) || [];

  // Get borrowing history
  const borrowHistory = transactionsData
    .filter(transaction => transaction.bookId === book.id)
    .sort((a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div className="animate-fade-in">
        <Link href="/books">
          <Button 
            variant="ghost" 
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-300"
          >
            ← Back to Books
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Book Cover and Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Cover Image */}
          <Card className="overflow-hidden animate-slide-up">
            <div className="aspect-[3/4] bg-gradient-to-br from-emerald-100 to-blue-100 relative">
              <img 
                src={imageError ? `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/bf683014-2b29-41ec-bf54-909b1f03cf60.png}` : book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                onError={() => setImageError(true)}
              />
              
              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <Badge className={cn("text-sm font-medium", getStatusColor(book.status))}>
                  {book.status}
                </Badge>
              </div>

              {/* Availability */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                <div className="text-sm font-medium text-gray-700">
                  {book.availableCopies}/{book.totalCopies} available
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 space-y-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h3 className="font-semibold text-lg text-gray-800">Quick Actions</h3>
            <div className="space-y-3">
              {book.status === 'available' && book.availableCopies > 0 ? (
                <Link href={`/checkout?bookId=${book.id}`}>
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    📤 Checkout Book
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="lg" 
                  disabled
                  className="w-full bg-gray-200 text-gray-500 font-semibold rounded-xl cursor-not-allowed"
                >
                  {book.status === 'borrowed' ? '📤 Currently Borrowed' : `📤 ${book.status}`}
                </Button>
              )}
              
              <Button 
                size="lg" 
                variant="outline"
                className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold rounded-xl transition-all duration-300"
              >
                💾 Add to Wishlist
              </Button>
            </div>
          </Card>
        </div>

        {/* Book Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="space-y-4 animate-fade-in">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                by {book.author}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge className={cn("text-sm", getCategoryColor(book.category))}>
                {book.category.replace('-', ' ')}
              </Badge>
              <Badge variant="outline" className="text-sm">
                Ages {book.ageGroup}
              </Badge>
              <Badge variant="outline" className="text-sm capitalize">
                {book.readingLevel} Level
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Published {book.publishedYear}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <Card className="p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-xl text-gray-800">About This Book</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-gray-700 leading-relaxed text-lg">
                {book.description}
              </p>
            </CardContent>
          </Card>

          {/* Book Information */}
          <Card className="p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-xl text-gray-800">Book Information</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ISBN:</span>
                    <span className="font-medium">{book.isbn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{book.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Copies:</span>
                    <span className="font-medium">{book.totalCopies}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-medium text-emerald-600">{book.availableCopies}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reading Level:</span>
                    <span className="font-medium capitalize">{book.readingLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age Group:</span>
                    <span className="font-medium">{book.ageGroup} years</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {book.tags && book.tags.length > 0 && (
            <Card className="p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-xl text-gray-800">Topics & Themes</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 hover:from-emerald-200 hover:to-blue-200 transition-all duration-300 capitalize"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Borrowers */}
          {currentBorrowers.length > 0 && (
            <Card className="p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-xl text-gray-800">Currently Borrowed By</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-3">
                  {currentBorrowers.map((student) => (
                    <div key={student?.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <img 
                        src={student?.photoUrl}
                        alt={student?.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/1b802391-df91-45c5-8167-a2b3b4a1611a.png || 'Student')}`;
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{student?.name}</div>
                        <div className="text-sm text-gray-600">{student?.classroom}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Due: {book.dueDate ? new Date(book.dueDate).toLocaleDateString() : 'Not set'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Borrowing History */}
          {borrowHistory.length > 0 && (
            <Card className="p-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-xl text-gray-800">Recent Borrowing History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-3">
                  {borrowHistory.map((transaction) => {
                    const student = studentsData.find(s => s.id === transaction.studentId);
                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{student?.name}</div>
                            <div className="text-gray-600">{student?.classroom}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 text-right">
                          <div>Borrowed: {new Date(transaction.borrowDate).toLocaleDateString()}</div>
                          {transaction.returnDate && (
                            <div>Returned: {new Date(transaction.returnDate).toLocaleDateString()}</div>
                          )}
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "mt-1",
                              transaction.status === 'returned' ? "text-emerald-600 border-emerald-200" :
                              transaction.status === 'active' ? "text-blue-600 border-blue-200" :
                              "text-gray-600 border-gray-200"
                            )}
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}