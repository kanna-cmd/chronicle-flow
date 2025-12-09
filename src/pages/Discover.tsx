import { MainLayout } from "@/components/layout/MainLayout";
import { BlogCard } from "@/components/blog/BlogCard";
import { FollowSuggestionCard } from "@/components/suggestions/FollowSuggestionCard";
import { TrendingCreators } from "@/components/suggestions/TrendingCreators";
import { mockBlogs, mockUsers, mockFollowSuggestions } from "@/data/mockData";
import { Compass, TrendingUp, Users, Hash, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Discover() {
  const trendingTags = [
    { tag: "AI", count: "12.5K" },
    { tag: "React", count: "8.2K" },
    { tag: "TypeScript", count: "6.8K" },
    { tag: "Design", count: "5.4K" },
    { tag: "Startups", count: "4.9K" },
    { tag: "Web3", count: "4.1K" },
    { tag: "Remote Work", count: "3.7K" },
    { tag: "Productivity", count: "3.2K" },
  ];

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
            <Compass className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl">Discover</h1>
            <p className="text-muted-foreground">
              Explore trending content and find new creators to follow
            </p>
          </div>
        </div>

        {/* Trending Creators Carousel */}
        <section className="mb-8 animate-fade-in">
          <TrendingCreators creators={mockUsers} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Trending Blogs */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="font-display font-semibold text-xl">Trending Now</h2>
              </div>
              <div className="space-y-6">
                {mockBlogs.slice(0, 3).map((blog, index) => (
                  <div
                    key={blog.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="animate-slide-up"
                  >
                    <BlogCard blog={blog} />
                  </div>
                ))}
              </div>
            </section>

            {/* Editor's Picks */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-accent" />
                <h2 className="font-display font-semibold text-xl">Editor's Picks</h2>
              </div>
              <div className="space-y-6">
                {mockBlogs.slice(3).map((blog, index) => (
                  <div
                    key={blog.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="animate-slide-up"
                  >
                    <BlogCard blog={blog} />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Trending Tags */}
            <div className="bg-card rounded-2xl border border-border p-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Hash className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-lg">Trending Tags</h3>
              </div>
              <div className="space-y-3">
                {trendingTags.map((item, index) => (
                  <div
                    key={item.tag}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-sm w-4">
                        {index + 1}
                      </span>
                      <Badge
                        variant="secondary"
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        #{item.tag}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.count} posts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Users */}
            <div className="bg-card rounded-2xl border border-border p-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-lg">
                  Based on Your Interests
                </h3>
              </div>
              <div className="space-y-4">
                {mockFollowSuggestions.map((suggestion) => (
                  <FollowSuggestionCard
                    key={suggestion.user.id}
                    suggestion={suggestion}
                  />
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-card rounded-2xl border border-border p-5 animate-fade-in">
              <h3 className="font-display font-semibold text-lg mb-4">
                Popular Categories
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Technology",
                  "Design",
                  "Business",
                  "Lifestyle",
                  "Travel",
                  "Health",
                  "Education",
                  "Entertainment",
                ].map((category) => (
                  <button
                    key={category}
                    className="px-4 py-2 bg-secondary/50 rounded-lg text-sm hover:bg-primary/10 hover:text-primary transition-colors text-left"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}
