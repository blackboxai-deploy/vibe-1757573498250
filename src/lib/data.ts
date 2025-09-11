// Mock data store for the Montessori Library System
import { Book, Student, BorrowTransaction, Achievement, LibraryStats } from '@/types/library';

// Sample achievements
export const achievements: Achievement[] = [
  {
    id: 'first-book',
    title: 'First Book Read',
    description: 'Completed your very first book!',
    icon: '📖',
    dateEarned: new Date('2024-09-01'),
    category: 'reading'
  },
  {
    id: 'early-bird',
    title: 'Early Bird Reader',
    description: 'Read 5 books this month',
    icon: '🐦',
    dateEarned: new Date('2024-10-15'),
    category: 'progress'
  },
  {
    id: 'helper',
    title: 'Library Helper',
    description: 'Helped organize books',
    icon: '🤝',
    dateEarned: new Date('2024-11-01'),
    category: 'helping'
  },
  {
    id: 'explorer',
    title: 'Genre Explorer',
    description: 'Read books from 3 different categories',
    icon: '🗺️',
    dateEarned: new Date('2024-11-15'),
    category: 'discovery'
  }
];

// Sample books data
export const booksData: Book[] = [
  {
    id: 'book-1',
    title: 'The Practical Life Adventures',
    author: 'Maria Montessori Jr.',
    isbn: '978-0123456789',
    category: 'practical-life',
    ageGroup: '3-6',
    status: 'available',
    coverImage: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2908cd04-045c-4d5b-a9b3-69af7a60d1e5.png',
    description: 'A wonderful journey through daily life activities that help children develop independence and confidence. Features beautiful illustrations of children cooking, cleaning, and caring for their environment.',
    publishedYear: 2023,
    totalCopies: 5,
    availableCopies: 3,
    readingLevel: 'beginner',
    tags: ['cooking', 'cleaning', 'independence', 'self-care'],
    location: 'Shelf A-1'
  },
  {
    id: 'book-2',
    title: 'Sensorial Discoveries',
    author: 'Dr. Elena Rodriguez',
    isbn: '978-0123456790',
    category: 'sensorial',
    ageGroup: '3-6',
    status: 'borrowed',
    coverImage: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c969c36e-dd8a-46de-8613-4a232ae97f26.png',
    description: 'Explore the world through your senses! This engaging book introduces children to different textures, shapes, colors, and materials in a fun and educational way.',
    publishedYear: 2022,
    totalCopies: 4,
    availableCopies: 0,
    borrowedBy: ['student-1', 'student-2'],
    dueDate: new Date('2024-12-15'),
    readingLevel: 'beginner',
    tags: ['senses', 'textures', 'shapes', 'colors'],
    location: 'Shelf A-2'
  },
  {
    id: 'book-3',
    title: 'Letters and Sounds Journey',
    author: 'Sarah Thompson',
    isbn: '978-0123456791',
    category: 'language',
    ageGroup: '6-9',
    status: 'available',
    coverImage: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a4456fa4-c3ca-423d-bf60-09cdb5b92bd9.png',
    description: 'An exciting adventure through the world of letters and sounds. Perfect for young learners beginning their reading and writing journey with phonics-based activities.',
    publishedYear: 2024,
    totalCopies: 6,
    availableCopies: 5,
    readingLevel: 'intermediate',
    tags: ['phonics', 'alphabet', 'reading', 'writing'],
    location: 'Shelf B-1'
  },
  {
    id: 'book-4',
    title: 'Mathematical Wonders',
    author: 'Prof. Ahmed Hassan',
    isbn: '978-0123456792',
    category: 'mathematics',
    ageGroup: '6-9',
    status: 'available',
    coverImage: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/1a5473a5-736f-4747-b1cc-d7621ac6becc.png',
    description: 'Discover the beauty of mathematics through hands-on activities and visual learning. From counting with golden beads to exploring geometric shapes.',
    publishedYear: 2023,
    totalCopies: 4,
    availableCopies: 4,
    readingLevel: 'intermediate',
    tags: ['numbers', 'counting', 'geometry', 'problem-solving'],
    location: 'Shelf B-2'
  },
  {
    id: 'book-5',
    title: 'Cultures Around the World',
    author: 'Dr. Priya Sharma',
    isbn: '978-0123456793',
    category: 'cultural',
    ageGroup: '9-12',
    status: 'available',
    coverImage: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/177cbe72-cc36-424d-ad9a-a36f73adfcc4.png',
    description: 'Take a fascinating journey around the world to explore different cultures, traditions, and celebrations. Learn about diversity and unity in our global community.',
    publishedYear: 2024,
    totalCopies: 3,
    availableCopies: 2,
    readingLevel: 'advanced',
    tags: ['culture', 'traditions', 'diversity', 'geography'],
    location: 'Shelf C-1'
  },
  {
    id: 'book-6',
    title: 'The Nature Explorer\'s Handbook',
    author: 'Emma Green',
    isbn: '978-0123456794',
    category: 'cultural',
    ageGroup: '6-9',
    status: 'available',
    coverImage: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/bc0068f9-7e73-462e-a451-ee41a18e21ab.png',
    description: 'A comprehensive guide to exploring nature and understanding our environment. Perfect for young naturalists who love outdoor adventures and learning about plants and animals.',
    publishedYear: 2023,
    totalCopies: 5,
    availableCopies: 4,
    readingLevel: 'intermediate',
    tags: ['nature', 'environment', 'animals', 'plants', 'outdoor'],
    location: 'Shelf C-2'
  },
  {
    id: 'book-7',
    title: 'Creative Arts and Crafts',
    author: 'Luna Martinez',
    isbn: '978-0123456795',
    category: 'general',
    ageGroup: '3-6',
    status: 'available',
    coverImage: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e8481a60-1b1a-4af2-a878-1f6212bc5fd7.png',
    description: 'Unleash your creativity with fun arts and crafts projects. From painting and drawing to simple sculptures, this book inspires young artists to express themselves.',
    publishedYear: 2024,
    totalCopies: 4,
    availableCopies: 3,
    readingLevel: 'beginner',
    tags: ['art', 'creativity', 'crafts', 'painting', 'drawing'],
    location: 'Shelf D-1'
  },
  {
    id: 'book-8',
    title: 'Science Experiments for Young Minds',
    author: 'Dr. Robert Chen',
    isbn: '978-0123456796',
    category: 'cultural',
    ageGroup: '9-12',
    status: 'reserved',
    coverImage: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/689e3bde-1313-4902-9868-67c41b8b0e01.png',
    description: 'Safe and exciting science experiments designed for curious young minds. Explore physics, chemistry, and biology through hands-on activities and discoveries.',
    publishedYear: 2023,
    totalCopies: 3,
    availableCopies: 1,
    readingLevel: 'advanced',
    tags: ['science', 'experiments', 'physics', 'chemistry', 'discovery'],
    location: 'Shelf D-2'
  }
];

// Sample students data
export const studentsData: Student[] = [
  {
    id: 'student-1',
    name: 'Sophie Anderson',
    age: 5,
    dateOfBirth: new Date('2019-03-15'),
    classroom: 'Primary A',
    teacher: 'Ms. Johnson',
    booksRead: 12,
    currentlyBorrowed: [booksData[1]], // Sensorial Discoveries
    readingLevel: 'beginner',
    favoriteCategories: ['sensorial', 'practical-life'],
    photoUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/21a59276-d5dc-46ee-9379-a220ad74c457.png',
    parentContact: {
      name: 'Jennifer Anderson',
      email: 'jennifer.anderson@email.com',
      phone: '+1-555-0101'
    },
    joinDate: new Date('2024-08-15'),
    readingGoal: 15,
    achievements: [achievements[0], achievements[1]]
  },
  {
    id: 'student-2',
    name: 'Marcus Williams',
    age: 7,
    dateOfBirth: new Date('2017-07-22'),
    classroom: 'Elementary B',
    teacher: 'Mr. Davis',
    booksRead: 18,
    currentlyBorrowed: [booksData[1]], // Sensorial Discoveries (shared copy)
    readingLevel: 'intermediate',
    favoriteCategories: ['mathematics', 'language'],
    photoUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2449e779-926c-4f0b-8c1f-a2edd3e033e9.png',
    parentContact: {
      name: 'Michael Williams',
      email: 'michael.williams@email.com',
      phone: '+1-555-0102'
    },
    joinDate: new Date('2024-08-20'),
    readingGoal: 20,
    achievements: [achievements[0], achievements[1], achievements[2]]
  },
  {
    id: 'student-3',
    name: 'Aria Patel',
    age: 9,
    dateOfBirth: new Date('2015-11-08'),
    classroom: 'Elementary A',
    teacher: 'Mrs. Lopez',
    booksRead: 25,
    currentlyBorrowed: [],
    readingLevel: 'advanced',
    favoriteCategories: ['cultural', 'mathematics'],
    photoUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/804545d7-a030-41d2-9005-af0f22e37673.png',
    parentContact: {
      name: 'Priya Patel',
      email: 'priya.patel@email.com',
      phone: '+1-555-0103'
    },
    joinDate: new Date('2024-08-10'),
    readingGoal: 30,
    achievements: [achievements[0], achievements[1], achievements[2], achievements[3]]
  },
  {
    id: 'student-4',
    name: 'Ethan Rodriguez',
    age: 4,
    dateOfBirth: new Date('2020-01-30'),
    classroom: 'Primary B',
    teacher: 'Ms. Taylor',
    booksRead: 6,
    currentlyBorrowed: [],
    readingLevel: 'beginner',
    favoriteCategories: ['practical-life', 'general'],
    photoUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e319268e-e0d1-4ad4-948a-a656bfdb2cd3.png',
    parentContact: {
      name: 'Carlos Rodriguez',
      email: 'carlos.rodriguez@email.com',
      phone: '+1-555-0104'
    },
    joinDate: new Date('2024-09-01'),
    readingGoal: 10,
    achievements: [achievements[0]]
  },
  {
    id: 'student-5',
    name: 'Zoe Thompson',
    age: 11,
    dateOfBirth: new Date('2013-05-12'),
    classroom: 'Elementary C',
    teacher: 'Dr. Kim',
    booksRead: 35,
    currentlyBorrowed: [],
    readingLevel: 'advanced',
    favoriteCategories: ['cultural', 'language'],
    photoUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/bce3012c-570b-469d-979e-0faebe406fb8.png',
    parentContact: {
      name: 'Sarah Thompson',
      email: 'sarah.thompson@email.com',
      phone: '+1-555-0105'
    },
    joinDate: new Date('2024-08-05'),
    readingGoal: 40,
    achievements: achievements // All achievements
  }
];

// Sample transactions
export const transactionsData: BorrowTransaction[] = [
  {
    id: 'trans-1',
    bookId: 'book-2',
    studentId: 'student-1',
    borrowDate: new Date('2024-11-01'),
    dueDate: new Date('2024-12-15'),
    status: 'active',
    renewalCount: 0,
    notes: 'First time borrowing this book'
  },
  {
    id: 'trans-2',
    bookId: 'book-2',
    studentId: 'student-2',
    borrowDate: new Date('2024-11-05'),
    dueDate: new Date('2024-12-15'),
    status: 'active',
    renewalCount: 1,
    notes: 'Renewed once due to high interest'
  }
];

// Library statistics
export const libraryStats: LibraryStats = {
  totalBooks: booksData.length,
  totalStudents: studentsData.length,
  booksCheckedOut: transactionsData.filter(t => t.status === 'active').length,
  booksOverdue: 0,
  popularBooks: [booksData[1], booksData[2], booksData[0]], // Most borrowed
  activeReaders: [studentsData[2], studentsData[4], studentsData[1]], // Most books read
  monthlyReadingGoalProgress: 78 // Percentage
};

// Helper functions
export const getBookById = (id: string): Book | undefined => {
  return booksData.find(book => book.id === id);
};

export const getStudentById = (id: string): Student | undefined => {
  return studentsData.find(student => student.id === id);
};

export const getAvailableBooks = (): Book[] => {
  return booksData.filter(book => book.status === 'available' && book.availableCopies > 0);
};

export const getBooksByCategory = (category: string): Book[] => {
  return booksData.filter(book => book.category === category);
};

export const getStudentsByClassroom = (classroom: string): Student[] => {
  return studentsData.filter(student => student.classroom === classroom);
};

export const getOverdueBooks = (): BorrowTransaction[] => {
  const today = new Date();
  return transactionsData.filter(
    transaction => transaction.status === 'active' && transaction.dueDate < today
  );
};

export const getStudentCurrentBooks = (studentId: string): Book[] => {
  const activeTransactions = transactionsData.filter(
    t => t.studentId === studentId && t.status === 'active'
  );
  return activeTransactions
    .map(t => getBookById(t.bookId))
    .filter((book): book is Book => book !== undefined);
};

// Data manipulation functions (simulate database operations)
export const addBook = (book: Omit<Book, 'id'>): Book => {
  const newBook: Book = {
    ...book,
    id: `book-${booksData.length + 1}`
  };
  booksData.push(newBook);
  return newBook;
};

export const addStudent = (student: Omit<Student, 'id'>): Student => {
  const newStudent: Student = {
    ...student,
    id: `student-${studentsData.length + 1}`
  };
  studentsData.push(newStudent);
  return newStudent;
};

export const borrowBook = (bookId: string, studentId: string): BorrowTransaction | null => {
  const book = getBookById(bookId);
  const student = getStudentById(studentId);
  
  if (!book || !student || book.availableCopies === 0) {
    return null;
  }

  // Create transaction
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14); // 2 weeks loan period

  const transaction: BorrowTransaction = {
    id: `trans-${transactionsData.length + 1}`,
    bookId,
    studentId,
    borrowDate: new Date(),
    dueDate,
    status: 'active',
    renewalCount: 0
  };

  // Update book availability
  book.availableCopies--;
  if (book.availableCopies === 0) {
    book.status = 'borrowed';
  }

  // Add to borrowed books list
  if (!book.borrowedBy) {
    book.borrowedBy = [];
  }
  book.borrowedBy.push(studentId);

  // Add to student's borrowed books
  student.currentlyBorrowed.push(book);

  transactionsData.push(transaction);
  return transaction;
};

export const returnBook = (transactionId: string): boolean => {
  const transaction = transactionsData.find(t => t.id === transactionId);
  if (!transaction || transaction.status !== 'active') {
    return false;
  }

  const book = getBookById(transaction.bookId);
  const student = getStudentById(transaction.studentId);

  if (!book || !student) {
    return false;
  }

  // Update transaction
  transaction.status = 'returned';
  transaction.returnDate = new Date();

  // Update book availability
  book.availableCopies++;
  book.status = 'available';

  // Remove from borrowed books list
  if (book.borrowedBy) {
    book.borrowedBy = book.borrowedBy.filter(id => id !== transaction.studentId);
  }

  // Remove from student's borrowed books
  student.currentlyBorrowed = student.currentlyBorrowed.filter(b => b.id !== transaction.bookId);

  // Update student's books read count
  student.booksRead++;

  return true;
};