import Chatbot from "./components/chatbot";
import BlogWall from "./components/blogwall";
import FeatureBlocks from "./components/featureblocks";
import { Post } from "./types";
import React, {useState, useEffect} from "react";

const STORAGE_KEY = 'pawpals_community_posts_v1';

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    author: 'Barkley_99',
    avatar: 'https://picsum.photos/seed/user1/100',
    content: "Just took Luna for her first beach walk! She absolutely loved the waves! 🌊🐕",
    image: 'https://picsum.photos/seed/dog1/600/400',
    timestamp: new Date(Date.now() - 3600000),
    likes: 24
  },
  {
    id: '2',
    author: 'CatPersonExtraordinaire',
    avatar: 'https://picsum.photos/seed/user2/100',
    content: "Does anyone have recommendations for the best catnip? My cat seems unimpressed with the store-bought ones. 🐈⬛",
    timestamp: new Date(Date.now() - 7200000),
    likes: 12
  }
];

const App: React.FC = () => {
  // Initialize state from local storage or fallback to defaults
  const [posts, setPosts] = useState<Post[]>(() => {
    const savedPosts = localStorage.getItem(STORAGE_KEY);
    if (savedPosts) {
      try {
        const parsed = JSON.parse(savedPosts);
        return parsed.map((p: any) => ({ 
          ...p, 
          timestamp: new Date(p.timestamp) 
        }));
      } catch (e) {
        return INITIAL_POSTS;
      }
    }
    return INITIAL_POSTS;
  });

  // Sync posts to local storage whenever the state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const addPost = (content: string, image?: string) => {
    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      author: 'You',
      avatar: 'https://picsum.photos/seed/me/100',
      content,
      image,
      timestamp: new Date(),
      likes: 0
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-xl text-white">
            <img src="https://cdn-icons-png.flaticon.com/128/2171/2171990.png" className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-brand font-bold text-slate-800">PawPals</h1>
        </div>
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
        <div className="w-500px mx-auto" style={{ backgroundColor: 'shimmering-orange' }}>
          <BlogWall posts={posts} onAddPost={addPost}/>
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