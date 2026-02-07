import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageSquare, ArrowLeft, Package, Paperclip, FileText, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface Conversation {
  id: string;
  user_id: string;
  order_id: string | null;
  subject: string | null;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  file_url: string | null;
  file_name: string | null;
}

const ChatPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get("order");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const orderChatInitialized = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("chat_conversations")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    if (!error && data) setConversations(data as Conversation[]);
    setLoadingConvs(false);
  }, [user]);

  // Handle order-linked chat creation - only once
  useEffect(() => {
    if (!user || !orderCode || orderChatInitialized.current) return;
    orderChatInitialized.current = true;

    const initOrderChat = async () => {
      const { data: order } = await supabase
        .from("orders")
        .select("id, order_code, items, brand_name")
        .eq("order_code", orderCode)
        .eq("user_id", user.id)
        .maybeSingle();

      if (!order) {
        toast.error("Pesanan tidak ditemukan.");
        return;
      }

      // Check if conversation exists for this order
      const { data: existing } = await supabase
        .from("chat_conversations")
        .select("id")
        .eq("order_id", order.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        setActiveConvId(existing.id);
        loadConversations();
      } else {
        const subject = `Pesanan ${order.order_code} - ${order.brand_name}`;
        const { data: newConv, error } = await supabase
          .from("chat_conversations")
          .insert({ user_id: user.id, order_id: order.id, subject })
          .select()
          .single();

        if (!error && newConv) {
          const conv = newConv as Conversation;
          setActiveConvId(conv.id);

          const items = Array.isArray(order.items)
            ? (order.items as any[]).map((i: any) => i.name).join(", ")
            : "";
          await supabase.from("chat_messages").insert({
            conversation_id: conv.id,
            sender_id: user.id,
            content: `Halo Admin, saya ingin berdiskusi tentang pesanan ${order.order_code} (${order.brand_name}).\nLayanan: ${items}`,
          });
          loadConversations();
        }
      }
    };

    initOrderChat();
  }, [user, orderCode, loadConversations]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load messages for active conversation with deduplication
  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", activeConvId)
        .order("created_at", { ascending: true });
      if (data) setMessages(data as ChatMessage[]);
    };

    loadMessages();

    const channel = supabase
      .channel(`messages-${activeConvId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${activeConvId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => {
            // Deduplicate by ID
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConvId]);

  useEffect(scrollToBottom, [messages]);

  // File selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("Ukuran file maksimal 10MB.");
      return;
    }

    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadFile = async (): Promise<{ url: string; name: string } | null> => {
    if (!selectedFile || !user) return null;
    setUploading(true);

    const ext = selectedFile.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("chat-attachments")
      .upload(path, selectedFile);

    if (error) {
      toast.error("Gagal mengupload file.");
      setUploading(false);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("chat-attachments")
      .getPublicUrl(path);

    setUploading(false);
    return { url: urlData.publicUrl, name: selectedFile.name };
  };

  const handleSend = async () => {
    if ((!newMessage.trim() && !selectedFile) || !activeConvId || !user) return;
    setSending(true);

    let fileData: { url: string; name: string } | null = null;
    if (selectedFile) {
      fileData = await uploadFile();
      if (!fileData && !newMessage.trim()) {
        setSending(false);
        return;
      }
    }

    const { error } = await supabase.from("chat_messages").insert({
      conversation_id: activeConvId,
      sender_id: user.id,
      content: newMessage.trim() || (fileData ? `📎 ${fileData.name}` : ""),
      file_url: fileData?.url || null,
      file_name: fileData?.name || null,
    });

    if (error) {
      toast.error("Gagal mengirim pesan.");
    } else {
      setNewMessage("");
      clearFile();
      await supabase
        .from("chat_conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", activeConvId);
    }
    setSending(false);
  };

  const handleNewConversation = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("chat_conversations")
      .insert({ user_id: user.id, subject: "Konsultasi Desain" })
      .select()
      .single();
    if (!error && data) {
      const conv = data as Conversation;
      setActiveConvId(conv.id);
      loadConversations();
    }
  };

  const isImageFile = (name: string | null) => {
    if (!name) return false;
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Chat dengan Admin</h1>
          <p className="text-muted-foreground mb-6">Masuk untuk memulai percakapan.</p>
          <Button onClick={() => navigate("/auth")}>Masuk / Daftar</Button>
        </div>
      </Layout>
    );
  }

  const activeConv = conversations.find((c) => c.id === activeConvId);

  return (
    <Layout>
      <div className="container py-6">
        <div className="glass-card rounded-xl overflow-hidden" style={{ height: "calc(100vh - 200px)" }}>
          <div className="flex h-full">
            {/* Conversation List */}
            <div
              className={`w-full md:w-80 border-r border-border flex flex-col ${
                activeConvId ? "hidden md:flex" : "flex"
              }`}
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold">Percakapan</h2>
                <Button size="sm" onClick={handleNewConversation}>
                  Chat Baru
                </Button>
              </div>
              <ScrollArea className="flex-1">
                {loadingConvs ? (
                  <p className="p-4 text-sm text-muted-foreground">Memuat...</p>
                ) : conversations.length === 0 ? (
                  <div className="p-6 text-center">
                    <MessageSquare className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Belum ada percakapan.</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConvId(conv.id)}
                      className={`w-full text-left p-4 border-b border-border/50 hover:bg-accent/50 transition-colors ${
                        activeConvId === conv.id ? "bg-accent" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {conv.order_id ? (
                          <Package className="h-4 w-4 text-primary shrink-0" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <span className="font-medium text-sm truncate">
                          {conv.subject || "Percakapan"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(conv.updated_at).toLocaleDateString("id-ID")}
                      </p>
                    </button>
                  ))
                )}
              </ScrollArea>
            </div>

            {/* Message Thread */}
            <div
              className={`flex-1 flex flex-col ${
                activeConvId ? "flex" : "hidden md:flex"
              }`}
            >
              {activeConvId ? (
                <>
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <button className="md:hidden" onClick={() => setActiveConvId(null)}>
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                      <h3 className="font-semibold text-sm">
                        {activeConv?.subject || "Percakapan"}
                      </h3>
                      <p className="text-xs text-muted-foreground">Admin KreasiVisual</p>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                      {messages.map((msg) => {
                        const isMe = msg.sender_id === user.id;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                                isMe
                                  ? "bg-primary text-primary-foreground rounded-br-md"
                                  : "bg-secondary text-secondary-foreground rounded-bl-md"
                              }`}
                            >
                              {/* File attachment */}
                              {msg.file_url && (
                                <a
                                  href={msg.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block mb-2"
                                >
                                  {isImageFile(msg.file_name) ? (
                                    <img
                                      src={msg.file_url}
                                      alt={msg.file_name || "image"}
                                      className="rounded-lg max-w-full max-h-48 object-cover"
                                    />
                                  ) : (
                                    <div className={`flex items-center gap-2 p-2 rounded-lg ${
                                      isMe ? "bg-primary-foreground/10" : "bg-accent"
                                    }`}>
                                      <FileText className="h-5 w-5 shrink-0" />
                                      <span className="text-xs truncate underline">
                                        {msg.file_name || "File"}
                                      </span>
                                    </div>
                                  )}
                                </a>
                              )}
                              {/* Text content (hide if it's just the file emoji placeholder) */}
                              {msg.content && !(msg.file_url && msg.content.startsWith("📎")) && (
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                              )}
                              <p
                                className={`text-[10px] mt-1 ${
                                  isMe ? "text-primary-foreground/60" : "text-muted-foreground"
                                }`}
                              >
                                {new Date(msg.created_at).toLocaleTimeString("id-ID", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* File preview */}
                  {selectedFile && (
                    <div className="px-4 pt-2 flex items-center gap-2 border-t border-border">
                      {previewUrl ? (
                        <img src={previewUrl} alt="preview" className="h-12 w-12 rounded object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded bg-accent flex items-center justify-center">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <span className="text-xs text-muted-foreground truncate flex-1">
                        {selectedFile.name}
                      </span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={clearFile}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  {/* Input */}
                  <div className="p-4 border-t border-border">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={sending || uploading}
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Ketik pesan..."
                        disabled={sending || uploading}
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={sending || uploading || (!newMessage.trim() && !selectedFile)}
                      >
                        {sending || uploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">Pilih percakapan atau mulai chat baru.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
