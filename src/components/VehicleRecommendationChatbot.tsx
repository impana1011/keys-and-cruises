import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AIChatMessage, getAIRecommendations } from "@/services/aiRecommendationService";
import { reviewService } from "@/services/reviewService";
import { StarRating } from "./StarRating";
import type { Vehicle } from "@/types";
import {
  ArrowRight,
  Bot,
  Car,
  ChevronDown,
  Fuel,
  Maximize2,
  MessageSquare,
  Minimize2,
  RotateCcw,
  Send,
  Sparkles,
  Users,
  X,
} from "lucide-react";

const INITIAL_MESSAGES: AIChatMessage[] = [
  {
    id: "m-0",
    sender: "assistant",
    text: "Hi there! 👋 I'm your DriveEase AI Fleet Advisor. Tell me about your upcoming trip — like how many people are travelling, your destination terrain, preferred transmission (Automatic/Manual), or daily budget — and I'll find the best vehicle for you!",
    timestamp: "Just now",
    tags: ["Personalized AI Recommendations", "Instant Search"],
  },
];

const PROMPT_SUGGESTIONS = [
  "Fuel-efficient automatic car for a family road trip under ₹2,000/day",
  "7-seater SUV for a mountain trip to Ooty",
  "12-seater Tempo Traveller for group trip to Goa",
  "Best CNG car for maximum fuel mileage",
  "Affordable daily commute bike under ₹500/day",
  "Luxury van with pushback seats for a wedding",
];

export function VehicleRecommendationChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const q = (textToSend ?? input).trim();
    if (!q) return;

    const userMsg: AIChatMessage = {
      id: "u-" + Date.now(),
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    // Simulate natural AI thinking delay
    setTimeout(() => {
      const res = getAIRecommendations(q);
      const botMsg: AIChatMessage = {
        id: "b-" + Date.now(),
        sender: "assistant",
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        recommendedVehicles: res.recommendedVehicles,
        tags: res.tags,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <aside aria-label="AI Fleet Advisor" className="fixed bottom-5 right-5 z-50 print:hidden">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 rounded-full bg-gradient-to-r from-primary via-primary/95 to-amber-500 px-4 py-3 text-sm font-bold text-primary-foreground shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
        >
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400" />
          </span>
          <Sparkles size={18} className="text-amber-200 group-hover:rotate-12 transition-transform" />
          <span>Ask AI Fleet Advisor</span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="flex h-[560px] w-[370px] sm:w-[420px] flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl transition-all duration-300 text-card-foreground animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-gradient-to-r from-primary to-primary/90 p-3.5 text-primary-foreground">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm leading-tight">
                  <span>DriveEase AI Advisor</span>
                  <span className="rounded-full bg-emerald-400 h-2 w-2" />
                </div>
                <p className="text-[10px] text-white/80">Autonomous Fleet Recommender</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              <button
                type="button"
                onClick={handleReset}
                className="rounded p-1 hover:bg-white/20 hover:text-white transition-colors"
                title="Restart Chat"
              >
                <RotateCcw size={15} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded p-1 hover:bg-white/20 hover:text-white transition-colors"
                title="Close Chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs bg-muted/20">
            {messages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-xs leading-relaxed ${
                      isUser
                        ? "bg-primary text-primary-foreground rounded-br-xs"
                        : "bg-card border text-card-foreground rounded-bl-xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>

                    {/* Tags */}
                    {m.tags && m.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {m.tags.map((t, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-primary/10 text-primary text-[10px] px-2 py-0.5 font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recommended Vehicles Cards inside Chat */}
                  {m.recommendedVehicles && m.recommendedVehicles.length > 0 && (
                    <div className="mt-2.5 w-full space-y-2">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                        <Sparkles size={11} className="text-amber-500" />
                        <span>Recommended Matches:</span>
                      </p>
                      {m.recommendedVehicles.map((v) => {
                        const rating = reviewService.getVehicleRatingSummary(v.id);
                        return (
                          <div
                            key={v.id}
                            className="overflow-hidden rounded-xl border bg-card p-2.5 shadow-xs hover:border-primary/50 transition-all flex gap-3 items-center"
                          >
                            <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                              {v.imageUrl ? (
                                <img
                                  src={v.imageUrl}
                                  alt={v.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                                  {v.category}
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="font-bold text-xs truncate text-foreground">{v.name}</h4>
                                <span className="font-extrabold text-primary text-xs shrink-0">
                                  ₹{v.pricePerDay}<span className="text-[10px] text-muted-foreground font-normal">/d</span>
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                                <span>{v.category}</span>
                                <span>·</span>
                                <span className="flex items-center gap-0.5">
                                  <Users size={10} />
                                  <span>{v.seats}</span>
                                </span>
                                <span>·</span>
                                <span>{v.transmission}</span>
                              </div>

                              <div className="flex items-center justify-between mt-1.5 pt-1 border-t">
                                <StarRating rating={rating.average} count={rating.count} size={11} />
                                <Link
                                  to="/vehicles/$id"
                                  params={{ id: v.id }}
                                  onClick={() => setIsOpen(false)}
                                  className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5"
                                >
                                  <span>Book</span>
                                  <ArrowRight size={10} />
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <span className="text-[9px] text-muted-foreground mt-1 px-1">{m.timestamp}</span>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 rounded-full bg-card border px-3 py-1.5 w-fit text-muted-foreground text-[11px] shadow-xs">
                <Sparkles size={12} className="animate-spin text-primary" />
                <span>Finding best fleet matches...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="border-t bg-card px-3 py-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Quick Inquiries:
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {PROMPT_SUGGESTIONS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(p)}
                  className="rounded-full border bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground text-[10px] px-2.5 py-1 whitespace-nowrap transition-colors shrink-0"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t bg-card p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Automatic car for family road trip under ₹2,000/day..."
              className="input flex-1 text-xs py-2"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="btn text-xs py-2 px-3 flex items-center gap-1 disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
