"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Mic, Volume2, Sparkles, User, Info, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Section from "@/components/ui/Section";
import { AI_CHARACTERS } from "@/lib/data";

type Message = { role: "user" | "ai"; text: string; time: string };

const STARTER_MSGS: Record<string, string> = {
  therapist: "Xin chào. Tôi là Tiến sĩ Evelyn. Đây là một không gian an toàn. Bạn cảm thấy thế nào hôm nay?",
  ceo: "Hãy đi thẳng vào vấn đề. Thử thách kinh doanh bạn đang gặp phải lúc này là gì?",
  friend: "Chào bồ! Có gì vui không? Có chuyện gì hay ho vừa xảy ra à? 😄",
  coach: "Rất vui được gặp bạn. Hãy nói cho tôi biết — bạn đang chuẩn bị cho vị trí công việc nào vậy?",
  psychologist: "Rất thú vị khi gặp bạn. Khía cạnh nào trong hành vi con người khiến bạn quan tâm nhất?",
  mafia: "Ngươi đến tìm ta… chỉ để nói chuyện sao. Thú vị đấy. Ngồi xuống đi. Ngươi muốn gì?",
};

export default function ChatPage() {
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const char = AI_CHARACTERS.find((c) => c.id === selectedCharId);

  const startChat = (id: string) => {
    setSelectedCharId(id);
    const starter = STARTER_MSGS[id] || "Xin chào! Hãy cùng trò chuyện nhé.";
    setMessages([{ role: "ai", text: starter, time: now() }]);
  };

  function now() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const sendMessage = () => {
    if (!input.trim() || !selectedCharId) return;
    const userMsg: Message = { role: "user", text: input, time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const reply = "Tôi hiểu ý bạn. Đó là một góc nhìn rất thú vị. Bạn có thể chia sẻ thêm về điều đó không?";
      setMessages((prev) => [...prev, { role: "ai", text: reply, time: now() }]);
      setTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div className="bg-primary min-h-screen flex flex-col">
      <Navbar />

      {/* Character Selection */}
      <AnimatePresence mode="wait">
        {!selectedCharId ? (
          <motion.main
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 pt-24 pb-12"
          >
            <Section>
              <div className="text-center mb-12">
                <Badge variant="violet" className="mb-4">6 Nhân vật AI</Badge>
                <h1 className="text-display mb-4">Trò chuyện <span className="gradient-text-gold">Tiếng Anh thực tế</span></h1>
                <p className="text-secondary max-w-xl mx-auto">Chọn một nhân vật để bắt đầu luyện tập giao tiếp với những cá tính và từ vựng độc đáo.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {AI_CHARACTERS.map((c, i) => (
                  <Card 
                    key={c.id} 
                    className="cursor-pointer group flex flex-col h-full" 
                    transition={{ delay: i * 0.05 }}
                    onClick={() => startChat(c.id)}
                  >
                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{c.emoji}</div>
                    <div className="font-display font-bold text-xl mb-1">{c.name}</div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: c.color }}>{c.role}</div>
                    <p className="text-sm text-secondary leading-relaxed mb-8 flex-1">{c.description}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <span className="text-xs font-bold" style={{ color: c.color }}>Bắt đầu chat ngay</span>
                      <ArrowRight size={16} style={{ color: c.color }} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </Card>
                ))}
              </div>
            </Section>
          </motion.main>
        ) : (
          <motion.main
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col pt-20"
          >
            {/* Chat Header */}
            <div className="glass-nav py-3 border-b border-white/5 sticky top-[64px] z-30">
              <div className="container-custom flex items-center gap-4">
                <button 
                  onClick={() => setSelectedCharId(null)} 
                  className="p-2 rounded-xl hover:bg-white/5 transition-all"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl glass" style={{ background: `${char?.color}15` }}>
                  {char?.emoji}
                </div>
                <div className="flex-1">
                  <div className="font-bold font-display">{char?.name}</div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent-emerald uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" /> Đang trực tuyến
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-glass-hover transition-all">
                    <Volume2 size={18} className="text-secondary" />
                  </button>
                  <button className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-glass-hover transition-all">
                    <Info size={18} className="text-secondary" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto py-8">
              <div className="container-custom max-w-2xl space-y-6">
                <div className="text-center py-8">
                  <Badge variant="outline" className="text-[10px]">Hôm nay, {new Date().toLocaleDateString('vi-VN')}</Badge>
                </div>

                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}
                    >
                      {msg.role === "ai" && (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg shrink-0 glass self-end mb-5">
                          {char?.emoji}
                        </div>
                      )}
                      <div className={`max-w-[80%] flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                        <div
                          className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-gradient-to-br from-accent-violet to-indigo-600 text-white rounded-br-sm"
                              : "glass bg-white/[0.05] border border-white/10 rounded-bl-sm"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] font-bold text-muted mt-1.5 px-1 uppercase tracking-tighter">
                          {msg.time}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg glass self-end mb-5">
                      {char?.emoji}
                    </div>
                    <div className="px-5 py-4 rounded-2xl glass bg-white/[0.03] border border-white/5 rounded-bl-sm">
                      <div className="flex gap-1.5 items-center">
                        {[0, 1, 2].map((i) => (
                          <motion.div 
                            key={i} 
                            className="w-1.5 h-1.5 rounded-full bg-accent-violet-bright"
                            animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, delay: i * 0.2, duration: 0.8 }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="glass-nav py-6 border-t border-white/5 sticky bottom-0">
              <div className="container-custom max-w-2xl">
                <div className="relative flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder={`Gửi tin nhắn cho ${char?.name}…`}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-4 pr-12 text-sm focus:outline-none focus:border-accent-violet/30 transition-all"
                    />
                    <button className="absolute right-3 inset-y-0 text-muted hover:text-accent-cyan transition-colors">
                      <Mic size={20} />
                    </button>
                  </div>
                  <motion.button
                    whileHover={input.trim() ? { scale: 1.05 } : {}}
                    whileTap={input.trim() ? { scale: 0.95 } : {}}
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      input.trim() 
                        ? "bg-gradient-to-br from-accent-violet to-indigo-600 shadow-glow-violet text-white" 
                        : "bg-white/5 text-muted border border-white/10"
                    }`}
                  >
                    <Send size={20} />
                  </motion.button>
                </div>
                <div className="flex justify-center mt-4">
                  <p className="text-[10px] text-muted font-medium uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={10} className="text-accent-gold" />
                    AI được tối ưu cho hội thoại tự nhiên
                  </p>
                </div>
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
