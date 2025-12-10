import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { currentUser } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

interface Author {
  _id?: string;
  id?: string;
  name?: string;
  avatar?: string;
}

interface BlogDetailData {
  id?: string;
  title?: string;
  content?: string;
  emoji?: string;
  image?: string;
  coverImage?: string;
  tags?: string[];
  author?: Author;
  authorId?: string;
  likes?: any;
  comments?: any;
  shares?: any;
  createdAt?: string;
}

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/blogs/${id}`);
        const data = await res.json();
        if (res.ok && data.success) {
          // Normalize shape if needed
          const b = data.data;
          const transformed = {
            id: b._id || b.id,
            title: b.title,
            content: b.content,
            emoji: b.emoji,
            image: b.image || b.coverImage,
            tags: b.tags || [],
            author: b.author || (b.authorId ? { id: b.authorId } : undefined),
            likes: Array.isArray(b.likes) ? b.likes.length : b.likes || 0,
            comments: Array.isArray(b.comments) ? b.comments.length : b.comments || 0,
            shares: Array.isArray(b.shares) ? b.shares.length : b.shares || 0,
            createdAt: b.createdAt,
          } as BlogDetailData;
          setBlog(transformed);
        } else {
          toast({ title: 'Error', description: data.message || 'Failed to load blog', variant: 'destructive' });
        }
      } catch (err: any) {
        toast({ title: 'Error', description: err.message || 'Failed to load blog', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto py-20 text-center">Loading blog...</div>
      </MainLayout>
    );
  }

  if (!blog) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto py-20 text-center">Blog not found.</div>
      </MainLayout>
    );
  }

  const isOwner = (blog.author && (blog.author._id === currentUser.id || blog.author.id === currentUser.id));

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar>
              {blog.author?.avatar ? (
                <AvatarImage src={blog.author.avatar} alt={blog.author?.name} />
              ) : (
                <AvatarFallback>{(blog.author?.name || 'U').charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <div className="font-medium">{blog.author?.name || 'Unknown'}</div>
              <div className="text-xs text-muted-foreground">{blog.createdAt ? formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true }) : ''}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwner && (
              <>
                <Button variant="outline" onClick={() => navigate(`/create?edit=${blog.id}`)}>Edit</Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    const ok = window.confirm('Are you sure you want to delete this blog? This action cannot be undone.');
                    if (!ok) return;
                    try {
                      const res = await fetch(`http://localhost:5000/api/blogs/delete/${blog.id}`, { method: 'DELETE' });
                      const json = await res.json();
                      if (res.ok && json.success) {
                        toast({ title: 'Deleted', description: 'Blog deleted successfully.' });
                        navigate('/');
                      } else {
                        toast({ title: 'Error', description: json.message || 'Failed to delete blog', variant: 'destructive' });
                      }
                    } catch (err: any) {
                      toast({ title: 'Error', description: err.message || 'Failed to delete blog', variant: 'destructive' });
                    }
                  }}
                >
                  Delete
                </Button>
              </>
            )}
            <Button onClick={() => window.scrollTo({ top: 9999, behavior: 'smooth' })}>Comments</Button>
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold mb-4">{blog.emoji} {blog.title}</h1>

        <div className="mb-6">
          <img src={blog.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop'} alt={blog.title} className="w-full h-[420px] object-cover rounded-xl" />
        </div>

        <div className="prose max-w-none mb-6">
          <p>{blog.content}</p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {blog.tags?.map((t) => (
            <Badge key={t} variant="secondary">#{t}</Badge>
          ))}
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-12">
          <div>{typeof blog.likes === 'number' ? blog.likes : 0} likes</div>
          <div>{typeof blog.comments === 'number' ? blog.comments : 0} comments</div>
          <div>{typeof blog.shares === 'number' ? blog.shares : 0} shares</div>
        </div>

        <div id="comments" className="space-y-4">
          <h3 className="font-semibold">Comments</h3>
          <div className="text-sm text-muted-foreground">Comments are not implemented yet.</div>
        </div>
      </div>
    </MainLayout>
  );
}
