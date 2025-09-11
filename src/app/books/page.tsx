"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { booksData, type Book } from "@/lib/data";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  index: number;
}

function BookCard({ book, index }: BookCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 50);
    return () => clearTimeout(timer);
  }, [index]);

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

  return (
    <div className={cn(
      "transition-all duration-500 transform",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    )}>
      <Link href={`/books/${book.id}`}>
        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden h-full">
          {/* Book Cover */}
          <div className="aspect-[3/4] bg-gradient-to-br from-emerald-100 to-blue-100 relative overflow-hidden">
            <img 
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/67dc4021-4ca0-4899-9c55-a7a6c12b125f.png}`;
              }}
            />
            
            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              <Badge className={cn("text-xs font-medium", getStatusColor(book.status))}>
                {book.status}
              </Badge>
            </div>

            {/* Available Copies */}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
              {book.availableCopies}/{book.totalCopies}
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-sm line-clamp-3">
                  {book.description}
                </p>
              </div>
            </div>
          </div>
          
          {/* Book Details */}
          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              <h3 className="font-bold text-lg group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600">
                by {book.author}
              </p>
            </div>
            
            {/* Tags and Categories */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                <Badge className={cn("text-xs", getCategoryColor(book.category))}>
                  {book.category.replace('-', ' ')}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {book.ageGroup}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {book.readingLevel}
                </Badge>
              </div>
              
              {/* Location */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>📍</span>
                <span>{book.location}</span>
              </div>
            </div>
            
            {/* Action Area */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Published {book.publishedYear}
                </span>
                {book.status === 'available' && book.availableCopies > 0 && (
                  <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                    Available Now
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

export default function BooksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [ageGroupFilter, setAgeGroupFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("title");

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    const filtered = booksData.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || book.category === categoryFilter;
      const matchesAgeGroup = ageGroupFilter === "all" || book.ageGroup === ageGroupFilter;
      const matchesStatus = statusFilter === "all" || book.status === statusFilter;

      return matchesSearch && matchesCategory && matchesAgeGroup && matchesStatus;
    });

    // Sort books
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "year":
          return b.publishedYear - a.publishedYear;
        case "available":
          return b.availableCopies - a.availableCopies;
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [searchTerm, categoryFilter, ageGroupFilter, statusFilter, sortBy]);

  // Get unique values for filters
  const categories = [...new Set(booksData.map(book => book.category))];
  const ageGroups = [...new Set(booksData.map(book => book.ageGroup))];
  const statuses = [...new Set(booksData.map(book => book.status))];

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setAgeGroupFilter("all");
    setStatusFilter("all");
    setSortBy("title");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="text-5xl animate-bounce">📚</div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          Our Book Collection
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover amazing books that inspire learning and imagination
        </p>
        <div className="text-lg font-medium text-emerald-600">
          {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} available
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 space-y-4 bg-white/80 backdrop-blur-sm border-emerald-100 animate-slide-up">
        {/* Search Bar */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search books by title, author, or description..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="border-emerald-200">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category} className="capitalize">
                  {category.replace('-', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={ageGroupFilter} onValueChange={setAgeGroupFilter}>
            <SelectTrigger className="border-emerald-200">
              <SelectValue placeholder="Age Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ages</SelectItem>
              {ageGroups.map(ageGroup => (
                <SelectItem key={ageGroup} value={ageGroup}>
                  Ages {ageGroup}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-emerald-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="border-emerald-200">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="author">Author A-Z</SelectItem>
              <SelectItem value="year">Newest First</SelectItem>
              <SelectItem value="available">Most Available</SelectItem>
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
          {categoryFilter !== "all" && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 capitalize">
              {categoryFilter.replace('-', ' ')}
              <button 
                onClick={() => setCategoryFilter("all")}
                className="ml-2 hover:text-green-900"
              >
                ✕
              </button>
            </Badge>
          )}
          {ageGroupFilter !== "all" && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              Ages {ageGroupFilter}
              <button 
                onClick={() => setAgeGroupFilter("all")}
                className="ml-2 hover:text-purple-900"
              >
                ✕
              </button>
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 capitalize">
              {statusFilter}
              <button 
                onClick={() => setStatusFilter("all")}
                className="ml-2 hover:text-orange-900"
              >
                ✕
              </button>
            </Badge>
          )}
        </div>
      </Card>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book, index) => (
            <BookCard key={book.id} book={book} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-4">
          <div className="text-6xl opacity-50">📚</div>
          <h3 className="text-2xl font-semibold text-gray-600">No books found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Try adjusting your search terms or filters to find the books you're looking for.
          </p>
          <Button 
            onClick={resetFilters}
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Add Book Button (for librarians) */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link href="/books/add">
          <Button 
            size="lg"
            className="rounded-full w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 text-2xl"
          >
            +
          </Button>
        </Link>
      </div>
    </div>
  );
}