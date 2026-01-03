"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send } from "lucide-react";
import { FaRegCircle } from "react-icons/fa";
import { Button } from "./ui/button";
import { enneagramFAQ } from "@/data/enneagram-faq";
import { enneagramTypes } from "@/data/enneagram-questions";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export function FAQChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const shouldHide = pathname.startsWith("/rooms");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm here to help you with Enneagram questions. Ask me about personality types, wings, or anything else!",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const suggestions = [
    "What is my Enneagram type?",
    "Tell me about Type 4",
    "What are wings and subtypes?",
    "How accurate is the assessment?",
    "What's my growth path?",
    "How do types relate to each other?",
  ];

  const COMMAND_HELP_TEXT = `🧭 Available Commands 🧭

/help or /?  
💡 Display this help menu with available commands.

/clear  
🧹 Clear the entire chat history to start fresh.

/taketest 
📝 Go to the Enneagram Test and answer questions to discover your personality type.

Tips for using the chatbot:  
• Type "/" anytime to see available commands.  
• Ask questions naturally, e.g., "Tell me about Type 4" or "What are wings?".  
• Combine commands and questions for faster navigation.

Happy exploring your Enneagram journey! 🌟
`;

  const findAnswer = (question: string): string => {
    const q = question.toLowerCase().trim();

    if (q.includes("who")) {
      return "👋 Hello my name is Jasper, your Enneagram Assistant!\n\n😊 I'm here to guide your questions.\n\n\(￣︶￣*\))\nJust ask me about Enneagram question.";
    }

    if (
      q.length < 3 ||
      ["hi", "hello", "hey", "what", "how", "help"].includes(q)
    ) {
      return "🌟 Welcome to your Enneagram journey!\n\nI'm here to guide you through the fascinating world of personality types. You can ask me about:\n\n• Specific Types (1-9) - Learn about motivations, fears, and growth paths\n• Wings & Subtypes - Discover how they influence your type\n• Assessment - How to find your type\n• Growth & Development - Your path to personal transformation\n\nWhat would you like to explore first?";
    }

    const typeNames: Record<string, number> = {
      perfectionist: 1,
      reformer: 1,
      helper: 2,
      giver: 2,
      achiever: 3,
      performer: 3,
      individualist: 4,
      artist: 4,
      romantic: 4,
      investigator: 5,
      thinker: 5,
      observer: 5,
      loyalist: 6,
      skeptic: 6,
      enthusiast: 7,
      adventurer: 7,
      challenger: 8,
      leader: 8,
      boss: 8,
      peacemaker: 9,
      mediator: 9,
    };

    for (let i = 1; i <= 9; i++) {
      if (q.includes(`type ${i}`) || q.includes(`${i}`)) {
        const type = enneagramTypes[i as keyof typeof enneagramTypes];
        return `🎯 Type ${i} - ${type.name}\n\n${
          type.description
        }\n\n🎯 Core Motivation: ${type.motivation}\n😰 Basic Fear: ${
          type.fear
        }\n\n💪 Key Strengths:\n${type.strengths
          .map((s) => `• ${s}`)
          .join("\n")}\n\n⚠️ Growth Areas:\n${type.challenges
          .map((c) => `• ${c}`)
          .join("\n")}\n\n🌱 Path to Growth: ${type.growth}\n😤 Under Stress: ${
          type.stress
        }`;
      }
    }

    for (const [name, typeNum] of Object.entries(typeNames)) {
      if (q.includes(name)) {
        const type = enneagramTypes[typeNum as keyof typeof enneagramTypes];
        return `🎯 Type ${typeNum} - ${type.name}\n\n${
          type.description
        }\n\n🎯 Core Motivation: ${type.motivation}\n😰 Basic Fear: ${
          type.fear
        }\n\n💪 Key Strengths:\n${type.strengths
          .map((s) => `• ${s}`)
          .join("\n")}\n\n⚠️ Growth Areas:\n${type.challenges
          .map((c) => `• ${c}`)
          .join("\n")}\n\n🌱 Path to Growth: ${type.growth}\n😤 Under Stress: ${
          type.stress
        }`;
      }
    }

    if (q.includes("wing") || q.includes("neighbor")) {
      return "🪶 Understanding Wings\n\nWings are the neighboring types that influence your core personality:\n\nHow Wings Work:\n• Everyone has access to both wings\n• One wing is usually more dominant\n• Wings add nuance and complexity\n\nExamples:\n• Type 1w9: More calm and idealistic\n• Type 1w2: More helpful and interpersonal\n• Type 4w3: More ambitious and image-conscious\n• Type 4w5: More withdrawn and intellectual\n\nWings don't change your core type - they flavor it!";
    }

    if (
      q.includes("test") ||
      q.includes("assessment") ||
      q.includes("quiz") ||
      q.includes("find my type") ||
      q.includes("personality")
    ) {
      return "📝 Discover Your Enneagram Type\n\nOur comprehensive assessment helps you identify your core personality type through:\n\n✨ What Makes It Accurate:\n• 45 carefully crafted questions\n• Focus on core motivations & fears\n• Based on Enneagram Institute research\n• Considers behavioral patterns\n\n🎯 What You'll Learn:\n• Your primary type (1-9)\n• Core motivations and fears\n• Growth and stress patterns\n• Personalized insights\n\n📍 Ready to start? Head to the Assessment section in the navigation to begin your journey of self-discovery!\n\nℹ️ Tip: Try typing the command --> /taketest";
    }

    if (
      q.includes("community") ||
      q.includes("join") ||
      q.includes("chat") ||
      q.includes("socialize") ||
      q.includes("connect") ||
      q.includes("rooms")
    ) {
      return "You can join our Community section to chat with others who share your Enneagram journey! Connect with people of your type or explore different perspectives. Look for the Community/Rooms section in the navigation to start chatting and socializing with fellow Enneagram enthusiasts.";
    }

    if (
      (q.includes("subtype") ||
        q.includes("instinct") ||
        q.includes("sp") ||
        q.includes("so") ||
        q.includes("sx")) &&
      !q.includes("chat") &&
      !q.includes("socialize")
    ) {
      return "🧠 Instinctual Subtypes: The Third Dimension\n\nSubtypes add crucial depth to your Enneagram type:\n\n🏠 Self-Preservation (SP)\n• Focus: Safety, comfort, resources\n• Concerns: Health, security, material needs\n• Energy: Inward, conservative\n\n👥 Social (SO)\n• Focus: Group dynamics, belonging\n• Concerns: Status, relationships, community\n• Energy: Outward, aware of social hierarchies\n\n⚡ Sexual/One-to-One (SX)\n• Focus: Intensity, chemistry, connection\n• Concerns: Attraction, energy, impact\n• Energy: Magnetic, seeking intensity\n\nYour dominant subtype significantly influences how your type manifests!";
    }

    if (
      q.includes("growth") ||
      q.includes("integration") ||
      q.includes("healthy")
    ) {
      return "Growth (Integration) happens when you move toward your integration point - the healthy aspects of another type. This represents your path to psychological health and personal development.";
    }

    if (
      q.includes("stress") ||
      q.includes("disintegration") ||
      q.includes("unhealthy")
    ) {
      return "Stress (Disintegration) occurs when you move toward your disintegration point - taking on the unhealthy aspects of another type. Recognizing this helps you manage stress better.";
    }

    if (q.includes("center") || q.includes("triad")) {
      return "The Enneagram has three centers:\n\n• Body/Gut (8,9,1): Focus on control and autonomy\n• Heart/Feeling (2,3,4): Focus on identity and image\n• Head/Thinking (5,6,7): Focus on security and certainty\n\nEach center has a different way of processing the world.";
    }

    for (const faq of enneagramFAQ.general) {
      const faqWords = faq.question.toLowerCase().split(" ");
      const questionWords = q.split(" ");
      if (
        questionWords.some((word) =>
          faqWords.some((faqWord) => faqWord.includes(word) && word.length > 2),
        )
      ) {
        return faq.answer;
      }
    }

    const fallbacks = [
      "🤔 Your question is a bit vague...\n\nI specialize in Enneagram wisdom. Here's what I can guide you through:\n\n🎯 Core Topics:\n• All 9 personality types\n• Wings & subtypes\n• Growth & stress patterns\n• Assessment guidance\n\n💡 Try asking:\n• Tell me about Type [1-9]\n• What are wings?\n• How do I find my type?\n• What's my growth path?\n\n\nℹ️ Tip: You can open the suggestion at the top right corner of the chat!",
      "🤔 Your question is a bit vague...\n\nI can help you understand:\n• Personality type descriptions\n• Motivations and fears\n• Personal growth paths\n• How to take the assessment\n\nWhat aspect of the Enneagram interests you most?\n\n\nℹ️ Tip: You can open the suggestion at the top right corner of the chat!",
      "🤔 Your question is a bit vague...\n\nI'm here to illuminate your Enneagram journey!\n\nWhether you're curious about:\n• Finding your type\n• Understanding relationships\n• Personal development\n• Type dynamics\n\nJust ask! I'm designed to make the Enneagram accessible and meaningful for you.\n\n\nℹ️ Tip: You can open the suggestion at the top right corner of the chat!",
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    if (
      input.trim() === "/" ||
      input.trim() === "/?" ||
      input.trim() === "/help"
    ) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: COMMAND_HELP_TEXT,
          isBot: true,
          timestamp: new Date(),
        },
      ]);
      setInput("");
      setShowSuggestions(false);
      return;
    }

    if (input === "/clear") {
      setMessages(() => []);
      setInput("");
      return;
    }

    if (input === "/taketest") {
      router.push("/enneagram/test");

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "🧭 We are now here in the ENNEAGRAM ASSESSMENT PAGE.\n\n🧑‍🦰 Just answer the required questions and discover your personality type.",
          isBot: true,
          timestamp: new Date(),
        },
      ]);

      setInput("");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setShowSuggestions(false);
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: findAnswer(userMessage.text),
      isBot: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botResponse]);
    setIsLoading(false);
  };

  if (shouldHide) {
    return null;
  }

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 glass-button border-2 border-[var(--typecircle-green)]/30 bg-gradient-to-br from-[var(--typecircle-green)]/20 to-blue-500/20 backdrop-blur-md hover:from-[var(--typecircle-green)]/30 hover:to-blue-500/30 transition-all duration-200"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--typecircle-green)]/10 border-2 border-[var(--typecircle-green)]/20 flex items-center justify-center">
                <FaRegCircle className="text-sm text-[var(--typecircle-green)]" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Jasper</h3>
                <p className="text-xs text-muted-foreground italic">
                  Enneagram Assistant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="h-8 w-8 p-0"
                title="Toggle suggestions"
              >
                <MessageCircle className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isBot ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-line ${
                    message.isBot
                      ? "bg-muted/50 text-foreground"
                      : "bg-[var(--typecircle-green)] text-white"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted/50 text-foreground max-w-[80%] p-3 rounded-lg text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {showSuggestions && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground text-center">
                  Try asking:
                </p>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(suggestion);
                      handleSend();
                    }}
                    className="w-full text-left p-2 text-xs bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about Enneagram..."
                className="flex-1 px-3 py-2 bg-muted/30 border border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--typecircle-green)]/50"
              />
              <Button
                onClick={handleSend}
                size="sm"
                className="btn-typecircle px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
