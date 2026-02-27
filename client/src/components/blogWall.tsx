import React, {useState} from 'react';
import { Post } from '../types';

interface BlogWallProps {
  posts: Post[];
  onAddPost: (content: string, image?: string) => void;
}

const BlogWall: React.FC<BlogWallProps> = ({posts, onAddPost}) => {
    const [newPost, setNewPost] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            if (selectedImage) {
                URL.revokeObjectURL(selectedImage); // clean up old image URL to prevent memory leaks
            }

            const url = URL.createObjectURL(e.target.files[0]);
            setSelectedImage(url);
        }
    }

    const handleAddPost = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPost.trim()) {
            onAddPost(newPost, selectedImage || undefined);
            setNewPost("");
            setSelectedImage(null);
        }
    }

    return (
        <div className="flex flex-col w-full h-full border-r border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100" style={{ backgroundColor: '#ffaf50' }}>
                <h2 className="text-xl font-brand font-bold text-black mb-4">Pet Stories</h2>
                <form onSubmit={handleAddPost} className="space-y-3">
                    <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Share a pet moment..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none transition-all"
                        rows={3}
                    />
                    <div className="flex items-center justify-between">
                        <label className="cursor-pointer group">
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        <div className="flex items-center gap-2 text-slate-500 group-hover:text-orange-600 transition-colors">
                            <svg className="w-5 h-a5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span className="text-sm font-medium">Add Photo</span>
                        </div>
                        </label>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
                            disabled={!newPost.trim() && !selectedImage}
                        >
                            Post
                        </button>
                    </div>
                    {selectedImage && (
                        <div className="relative inline-block mt-2">
                        <img src={selectedImage} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                        <button 
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >✕</button>
                        </div>
                    )}
                </form>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" style={{ backgroundColor: 'light-gray' }}>
                {posts.map((post) => (
                <div key={post.id} className="blog-card animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-3">
                        <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full border border-slate-100" />
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">{post.author}</h4>
                            <p className="text-xs text-slate-400">{new Date(post.timestamp).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <p className="text-slate-600 text-sm mb-3 leading-relaxed">{post.content}</p>
                    {post.image && (
                    <img src={post.image} alt="Post content" className="w-half h-half object-cover rounded-xl mb-3" />
                    )}
                    <div className="flex items-center gap-4">
                    <button className="action-button like">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        <span>{post.likes}</span>
                    </button>
                    <button className="action-button comment">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <span>Comment</span>
                    </button>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}

export default BlogWall;