
export interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  timestamp: Date;
  likes: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
