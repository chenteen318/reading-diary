// Data model for a reading diary entry
export interface ReadingEntry {
  id: string;
  bookTitle: string;
  author: string;
  thought: string;
  tags: string[];
  coverImage: string; // base64
  pageImage: string; // base64
  styledCoverImage: string; // base64 with filters
  styledPageImage: string; // base64 with filters
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface DiaryData {
  entries: ReadingEntry[];
}
