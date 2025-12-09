import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Image, 
  X, 
  Sparkles, 
  Upload,
  Tag,
  Send,
  Save,
  ArrowLeft
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const EMOJIS = ["📝", "💡", "🚀", "⚛️", "🤖", "🎨", "💻", "📱", "🌐", "🔥", "✨", "🎯"];

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "formal", label: "Formal" },
  { value: "humorous", label: "Humorous" },
  { value: "creative", label: "Creative" },
];

const LENGTHS = [
  { value: "short", label: "Short (~200 words)" },
  { value: "medium", label: "Medium (~500 words)" },
  { value: "long", label: "Long (~1000 words)" },
];

export default function CreateBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [emoji, setEmoji] = useState("📝");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");
  const [aiTone, setAITone] = useState("professional");
  const [aiLength, setAILength] = useState("medium");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,/g, "");
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleGenerateContent = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt for AI content generation.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const generatedContent = `Here's a ${aiLength} ${aiTone} blog post about "${aiPrompt}":\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

    setContent(generatedContent);
    setIsGenerating(false);
    setShowAIPanel(false);

    toast({
      title: "Content generated!",
      description: "AI has generated content based on your prompt.",
    });
  };

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in the title and content.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Blog published!",
      description: "Your blog has been published successfully.",
    });

    navigate("/");
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft saved",
      description: "Your blog has been saved as a draft.",
    });
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button variant="gradient" onClick={handlePublish}>
              <Send className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-md animate-fade-in">
          <h1 className="font-display font-bold text-2xl mb-6">Create New Blog</h1>

          <div className="space-y-6">
            {/* Emoji Picker */}
            <div className="space-y-2">
              <Label>Blog Emoji</Label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(e)}
                    className={cn(
                      "w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all",
                      emoji === e
                        ? "bg-primary/10 ring-2 ring-primary"
                        : "bg-secondary hover:bg-secondary/80"
                    )}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Blog Title</Label>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{emoji}</span>
                <Input
                  id="title"
                  placeholder="Enter an engaging title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium"
                />
              </div>
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <Label>Cover Image</Label>
              {coverImage ? (
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setCoverImage(null)}
                    className="absolute top-2 right-2 w-8 h-8 bg-foreground/80 rounded-full flex items-center justify-center text-background hover:bg-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors bg-secondary/30">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click or drag to upload cover image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Content</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAIPanel(!showAIPanel)}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4 text-accent" />
                  AI Generate
                </Button>
              </div>

              {/* AI Generation Panel */}
              {showAIPanel && (
                <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl space-y-4 animate-slide-down">
                  <div className="flex items-center gap-2 text-accent">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-medium">AI Content Generator</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="aiPrompt">What would you like to write about?</Label>
                      <Textarea
                        id="aiPrompt"
                        placeholder="E.g., The benefits of remote work for developers..."
                        value={aiPrompt}
                        onChange={(e) => setAIPrompt(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Tone</Label>
                        <Select value={aiTone} onValueChange={setAITone}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TONES.map((tone) => (
                              <SelectItem key={tone.value} value={tone.value}>
                                {tone.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Length</Label>
                        <Select value={aiLength} onValueChange={setAILength}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LENGTHS.map((length) => (
                              <SelectItem key={length.value} value={length.value}>
                                {length.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerateContent}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Generating...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Generate Content
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <Textarea
                id="content"
                placeholder="Write your blog content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] resize-y"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (max 5)</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="tags"
                  placeholder="Add tags (press Enter)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="pl-10"
                  disabled={tags.length >= 5}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
