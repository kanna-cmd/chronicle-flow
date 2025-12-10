import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  UserPlus,
  Share2,
  Trash2,
  CheckCheck,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "share";
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  message: string;
  blogId?: string;
  blogTitle?: string;
  createdAt: string;
  read: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    // Load mock notifications
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "like",
        user: { id: "1", name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face" },
        message: "liked your blog",
        blogId: "blog1",
        blogTitle: "Getting Started with React",
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        read: false,
      },
      {
        id: "2",
        type: "comment",
        user: { id: "2", name: "Alex Kumar", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
        message: "commented on your blog",
        blogId: "blog2",
        blogTitle: "Web Development Tips",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        read: false,
      },
      {
        id: "3",
        type: "follow",
        user: { id: "3", name: "Jordan Smith", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
        message: "started following you",
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        read: false,
      },
      {
        id: "4",
        type: "share",
        user: { id: "4", name: "Emma Wilson", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
        message: "shared your blog",
        blogId: "blog3",
        blogTitle: "JavaScript Best Practices",
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        read: true,
      },
      {
        id: "5",
        type: "like",
        user: { id: "5", name: "Mike Johnson", avatar: "https://images.unsplash.com/photo-1500595046891-98c1f73e9b18?w=150&h=150&fit=crop&crop=face" },
        message: "liked your blog",
        blogId: "blog4",
        blogTitle: "CSS Mastery",
        createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        read: true,
      },
    ];

    setNotifications(mockNotifications);
    setLoading(false);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-5 w-5 text-red-500" />;
      case "comment":
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case "follow":
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case "share":
        return <Share2 className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast({ title: "All notifications marked as read" });
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    toast({ title: "All notifications cleared" });
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter(n => !n.read)
      : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="destructive" size="sm" onClick={clearAll}>
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All ({notifications.length})
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
          >
            Unread ({unreadCount})
          </Button>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  notification.read
                    ? "bg-card border-border hover:bg-secondary/30"
                    : "bg-primary/5 border-primary/30 hover:bg-primary/10"
                }`}
              >
                {/* Icon */}
                <div className="mt-1 flex-shrink-0">
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      to={`/profile/${notification.user.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                        <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div>
                      <Link
                        to={`/profile/${notification.user.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {notification.user.name}
                      </Link>
                      <span className="text-muted-foreground ml-1">{notification.message}</span>
                    </div>
                  </div>

                  {notification.blogId && notification.blogTitle && (
                    <Link
                      to={`/blog/${notification.blogId}`}
                      className="text-sm text-primary hover:underline block truncate"
                    >
                      "{notification.blogTitle}"
                    </Link>
                  )}

                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>

                {/* Unread Badge & Delete */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!notification.read && (
                    <Badge variant="default" className="h-2 w-2 rounded-full p-0" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No notifications</p>
            <p className="text-muted-foreground">
              {filter === "unread"
                ? "You're all caught up!"
                : "You don't have any notifications yet."}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
