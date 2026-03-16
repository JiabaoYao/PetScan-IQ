import Chatbot from "../components/chatbot";
import BlogWall from "../components/blogWall";
import FeatureBlocks from "../components/featureblocks";
import { Post } from "../types";
import React, {useState, useEffect} from "react";
import { User } from "../types";

const STORAGE_KEY = 'pawpals_community_posts_v1';
// Use relative /api so Vite dev server proxies to backend (no direct connection to :8000 from browser)
const API_BASE = '/api';

const INITIAL_POSTS: Post[] = [
  {
    blog_id: '1',
    author: 'Barkley_99',
    avatar: 'https://picsum.photos/seed/user1/100',
    content: "Just took Luna for her first beach walk! She absolutely loved the waves! 🌊🐕",
    title: "First Beach Walk!",
    image: 'https://picsum.photos/seed/dog1/600/400',
    timestamp: new Date(Date.now() - 3600000),
    likes: 24
  },
  {
    blog_id: '2',
    author: 'CatPersonExtraordinaire',
    avatar: 'https://picsum.photos/seed/user2/100',
    content: "Does anyone have recommendations for the best catnip? My cat seems unimpressed with the store-bought ones. 🐈⬛",
    title: "Best Catnip Recommendations?",
    timestamp: new Date(Date.now() - 7200000),
    likes: 12
  }
];



const App: React.FC = () => {
  // Initialize state from local storage or fallback to defaults
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  /** Map API blog shape (created_at, no avatar) to frontend Post shape (timestamp, avatar). */
  const parseDate = (v: unknown): Date => {
    if (v == null) return new Date();
    if (typeof v === 'string') return new Date(v);
    if (typeof v === 'object' && v !== null && '$date' in v) return new Date((v as { $date: string }).$date);
    return new Date();
  };

  const mapBlogToPost = (raw: Record<string, unknown>): Post => ({
    user_id: localStorage.getItem('token') ?? '',
    blog_id: String(raw.blog_id ?? raw.id ?? ''),
    author: String(raw.author ?? ''),
    avatar: String(raw.avatar ?? 'https://picsum.photos/seed/user/100'),
    content: String(raw.content ?? ''),
    title: raw.title != null ? String(raw.title) : undefined,
    image: raw.image != null && raw.image !== '' ? String(raw.image) : undefined,
    timestamp: parseDate(raw.timestamp ?? raw.created_at),
    likes: Number(raw.likes ?? 0),
  });

  const refetchPosts = async () => {
    try {
      const response = await fetch(`${API_BASE}/blogs`, { method: 'GET' });
      if (!response.ok) {
        const text = await response.text();
        console.error('Error fetching posts:', response.status, text);
        setPosts(INITIAL_POSTS);
        return;
      }
      const data = await response.json();
      const list = Array.isArray(data) ? data : [];
      setPosts(list.map(mapBlogToPost));
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts(INITIAL_POSTS); // Fallback to default posts on error
    }
  };

  useEffect(() => {
    refetchPosts();
  }, []);

  const addPost = async(content: string, title?:string, image?: string) => {
    const userId = localStorage.getItem('token') ?? '';
    const user = await getUser(userId);

    const newPost = {
      user_id: userId,
      blog_id: Math.random().toString(36).substr(2, 9),
      author: user.name,
      content,
      title,
      image: image ?? undefined,
      likes: 0
    };

    try {
      const res = await fetch(`${API_BASE}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
      });
      if (!res.ok) {
        const text = await res.text();
        console.error('Error adding post:', res.status, text);
        return;
      }
    } catch (error) {
      console.error('Error adding post:', error);
      return;
    }
    await refetchPosts();
  }

  const deletePost = async (blog_id: string) => {
    console.log(posts);
    try {
      const res = await fetch(`${API_BASE}/blogs/${blog_id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }

    await refetchPosts();
  }

  const getUser = async (userId: string) => {
    const response = await fetch(`${API_BASE}/users/me?user_id=${userId}`, { method: 'GET' });
    if (!response.ok) {
      throw new Error('Failed to get user');
    }
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    const userId = localStorage.getItem('token') ?? '';
    if (!userId) return;
    getUser(userId)
      .then((data) => setUser(data as User))
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-md">
        {user && (
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-xl text-white">
              <img src="https://cdn-icons-png.flaticon.com/128/2171/2171990.png" className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-brand font-bold text-slate-800">{user.name}</h1>
          </div>
        )}
        <nav className="hidden md:flex items-center gap-8 text-slate-500 font-large">
          <a href="#" className="text-orange-500 border-b-2 border-orange-500 py-1 text-lg font-bold">Community</a>
          <a href="#" className="hover:text-slate-800 transition-colors text-lg font-bold">Marketplace</a>
          <a href="#" className="hover:text-slate-800 transition-colors text-lg font-bold">Vet Finder</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </button>
          <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Neko" className="className=w-10 h-10 rounded-full border-2 border-emerald-400 bg-emerald-50 shadow-sm" alt="avatar" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Blog Wall */}
        <div className="w-[800px] mx-auto" style={{ backgroundColor: 'shimmering-orange' }}>
          <BlogWall posts={posts} onAddPost={addPost} onDeletePost={deletePost}/>
        </div>

        {/* Middle Section: AI Tools */}
        <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ backgroundImage: `url(https://i.pinimg.com/736x/0b/04/c3/0b04c3f9711ab1ffbd562bdeeede67a9.jpg)`, backgroundSize: 'cover', backgroundPosition: 'top' }}>
          <div className="max-w-4xl mx-auto py-8">
            <div className="px-8 mb-8">
              <h2 className="text-3xl font-brand font-bold text-slate-800 mb-2">Pet Innovation Lab</h2>
              <p className="text-slate-500" style={{ color: 'black' }}>Explore cutting-edge AI features.</p>
            </div>
            <FeatureBlocks />
          </div>
        </div>
      </main>

      {/* Floating Chatbot */}
      <Chatbot />
    </div>
  );
};

export default App;