import { MainLayout } from "@/components/layout/MainLayout";
import { BlogCard } from "@/components/blog/BlogCard";
import { FollowSuggestionCard } from "@/components/suggestions/FollowSuggestionCard";
import { TrendingCreators } from "@/components/suggestions/TrendingCreators";
import { mockBlogs, mockUsers, mockFollowSuggestions, currentUser } from "@/data/mockData";
import { TrendingUp, Users } from "lucide-react";

export default function Home() {
  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h1 className="font-display font-bold text-2xl">Your Feed</h1>
          </div>
          
          {mockBlogs.map((blog, index) => (
            <div
              key={blog.id}
              style={{ animationDelay: `${index * 100}ms` }}
              className="animate-slide-up"
            >
              <BlogCard blog={blog} isOwner={blog.authorId === currentUser.id} />
            </div>
          ))}
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
