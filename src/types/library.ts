// TypeScript interfaces for the Montessori Library System

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: 'practical-life' | 'sensorial' | 'language' | 'mathematics' | 'cultural' | 'general';
  ageGroup: '3-6' | '6-9' | '9-12' | 'all-ages';
  status: 'available' | 'borrowed' | 'reserved' | 'maintenance';
  coverImage: string;
  description: string;
  publishedYear: number;
  totalCopies: number;
  availableCopies: number;
  borrowedBy?: string[];
  dueDate?: Date;
  readingLevel: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  location: string; // Shelf location in library
}

export interface Student {
  id: string;
  name: string;
  age: number;
  dateOfBirth: Date;
  classroom: string;
  teacher: string;
  booksRead: number;
  currentlyBorrowed: Book[];
  readingLevel: 'beginner' | 'intermediate' | 'advanced';
  favoriteCategories: string[];
  photoUrl: string;
  parentContact: {
    name: string;
    email: string;
    phone: string;
  };
  joinDate: Date;
  readingGoal: number; // Books per month/semester
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateEarned: Date;
  category: 'reading' | 'discovery' | 'helping' | 'progress';
}

export interface BorrowTransaction {
  id: string;
  bookId: string;
  studentId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'active' | 'returned' | 'overdue' | 'lost';
  renewalCount: number;
  notes?: string;
}

export interface ReadingSession {
  id: string;
  studentId: string;
  bookId: string;
  date: Date;
  duration: number; // in minutes
  pagesRead: number;
  comprehensionRating: 1 | 2 | 3 | 4 | 5; // stars
  enjoymentRating: 1 | 2 | 3 | 4 | 5; // stars
  notes?: string;
}

export interface LibraryStats {
  totalBooks: number;
  totalStudents: number;
  booksCheckedOut: number;
  booksOverdue: number;
  popularBooks: Book[];
  activeReaders: Student[];
  monthlyReadingGoalProgress: number;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  classroom: string;
  students: string[]; // Student IDs
  specializations: string[];
}

export interface LibrarySettings {
  borrowPeriodDays: number;
  maxBooksPerStudent: number;
  maxRenewals: number;
  overdueNotifications: boolean;
  readingGoalTracking: boolean;
  achievementSystem: boolean;
}

// Utility types
export type BookCategory = Book['category'];
export type AgeGroup = Book['ageGroup'];
export type ReadingLevel = Book['readingLevel'];
export type BookStatus = Book['status'];
export type TransactionStatus = BorrowTransaction['status'];

// Search and filter interfaces
export interface BookFilters {
  category?: BookCategory[];
  ageGroup?: AgeGroup[];
  readingLevel?: ReadingLevel[];
  status?: BookStatus[];
  author?: string;
  title?: string;
  available?: boolean;
}

export interface StudentFilters {
  classroom?: string[];
  teacher?: string[];
  ageRange?: {min: number; max: number};
  readingLevel?: ReadingLevel[];
  hasOverdueBooks?: boolean;
}

// Component prop types
export interface BookCardProps {
  book: Book;
  showActions?: boolean;
  onBorrow?: (bookId: string) => void;
  onReserve?: (bookId: string) => void;
  onViewDetails?: (bookId: string) => void;
}

export interface StudentCardProps {
  student: Student;
  showStats?: boolean;
  onViewProfile?: (studentId: string) => void;
  onCheckout?: (studentId: string) => void;
}

// Form data types
export interface AddBookFormData {
  title: string;
  author: string;
  isbn: string;
  category: BookCategory;
  ageGroup: AgeGroup;
  description: string;
  publishedYear: number;
  totalCopies: number;
  readingLevel: ReadingLevel;
  tags: string[];
  location: string;
  coverImage?: File;
}

export interface AddStudentFormData {
  name: string;
  age: number;
  dateOfBirth: Date;
  classroom: string;
  teacher: string;
  readingLevel: ReadingLevel;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  photoUrl?: File;
}