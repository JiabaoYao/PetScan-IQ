
export interface Post {
  blog_id: string;
  author: string;
  avatar: string;
  content: string;
  title?: string;
  image?: string;
  timestamp: Date;
  likes: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
