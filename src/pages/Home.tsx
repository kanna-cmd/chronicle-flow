import { MainLayout } from "@/components/layout/MainLayout";
import { BlogCard } from "@/components/blog/BlogCard";
import { FollowSuggestionCard } from "@/components/suggestions/FollowSuggestionCard";
import { TrendingCreators } from "@/components/suggestions/TrendingCreators";
import { mockUsers, mockFollowSuggestions, currentUser } from "@/data/mockData";
import { TrendingUp, Users, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { Blog } from "@/types/blog";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      console.log('📥 Fetching blogs from API...');
      const response = await fetch('http://localhost:5000/api/blogs/all');
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Fetched ${data.data?.length || 0} blogs`);
        setBlogs(data.data || []);
      } else {
        console.error('❌ Failed to fetch blogs - Status:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching blogs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    
    // Refetch blogs every 5 seconds to catch newly created ones
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing blogs...');
      fetchBlogs();
    }, 5000);

    // Also listen for visibility change - refetch when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👀 Page became visible - refreshing blogs');
        fetchBlogs();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    console.log('🔄 Manual refresh triggered');
    await fetchBlogs();
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h1 className="font-display font-bold text-2xl">Your Feed</h1>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
          
          {loading ? (
            <div className="text-center text-muted-foreground py-12">
              <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
              Loading blogs...
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 bg-card rounded-2xl border border-border">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No blogs available yet</p>
              <p className="text-sm">Start creating or check back soon!</p>
            </div>
          ) : (
            <>
              <div className="text-sm text-muted-foreground mb-4">
                Showing {blogs.length} blog{blogs.length !== 1 ? 's' : ''}
              </div>
              {blogs.map((blog, index) => (
                <div
                  key={blog.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="animate-slide-up"
                >
                  <BlogCard blog={blog} isOwner={blog.authorId === currentUser.id} />
                </div>
              ))}
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Trending Creators */}
          <TrendingCreators creators={mockUsers.slice(0, 5)} />

          {/* Follow Suggestions */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-display font-semibold text-lg">Suggested for You</h3>
            </div>
            <div className="space-y-4">
              {mockFollowSuggestions.map((suggestion) => (
                <FollowSuggestionCard key={suggestion.user.id} suggestion={suggestion} />
              ))}
            </div>
          </div>

          {/* Trending Tags */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="font-display font-semibold text-lg mb-4">Trending Tags</h3>
            <div className="flex flex-wrap gap-2">
              {["React", "AI", "Design", "Startups", "Web3", "TypeScript", "UX", "Remote Work"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-secondary rounded-full text-sm text-secondary-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-xs text-muted-foreground space-y-2">
            <div className="flex flex-wrap gap-2">
              <a href="#" className="hover:underline">About</a>
              <span>•</span>
              <a href="#" className="hover:underline">Help</a>
              <span>•</span>
              <a href="#" className="hover:underline">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:underline">Terms</a>
            </div>
            <p>© 2024 BlogSphere</p>
          </div>
        </aside>
      </div>
    </MainLayout>
  );
}
