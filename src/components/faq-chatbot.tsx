"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "./ui/button";
import { enneagramFAQ } from "@/data/enneagram-faq";
import { enneagramTypes } from "@/data/enneagram-questions";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export function FAQChatbot() {
  const [isOpen, setIsOpen] = useState(false);
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

  const suggestions = [
    "What is my Enneagram type?",
    "Tell me about Type 1",
    "What are wings?",
    "How do I take the test?",
    "What are subtypes?"
  ];

  const findAnswer = (question: string): string => {
    const q = question.toLowerCase().trim();
    
    // Handle vague or empty questions
    if (q.length < 3 || ['hi', 'hello', 'hey', 'what', 'how', 'help'].includes(q)) {
      return "I'd be happy to help! You can ask me about Enneagram types (1-9), wings, subtypes, taking the assessment, or any specific personality questions.";
    }
    
    // Type name mappings
    const typeNames: Record<string, number> = {
      'perfectionist': 1, 'reformer': 1,
      'helper': 2, 'giver': 2,
      'achiever': 3, 'performer': 3,
      'individualist': 4, 'artist': 4, 'romantic': 4,
      'investigator': 5, 'thinker': 5, 'observer': 5,
      'loyalist': 6, 'skeptic': 6,
      'enthusiast': 7, 'adventurer': 7,
      'challenger': 8, 'leader': 8, 'boss': 8,
      'peacemaker': 9, 'mediator': 9
    };
    
    // Check for type-specific questions (more flexible)
    for (let i = 1; i <= 9; i++) {
      if (q.includes(`type ${i}`) || q.includes(`${i}`)) {
        const type = enneagramTypes[i as keyof typeof enneagramTypes];
        return `**Type ${i} - ${type.name}**\n\n${type.description}\n\n**Core Motivation:** ${type.motivation}\n**Basic Fear:** ${type.fear}`;
      }
    }
    
    // Check type names
    for (const [name, typeNum] of Object.entries(typeNames)) {
      if (q.includes(name)) {
        const type = enneagramTypes[typeNum as keyof typeof enneagramTypes];
        return `**Type ${typeNum} - ${type.name}**\n\n${type.description}\n\n**Core Motivation:** ${type.motivation}\n**Basic Fear:** ${type.fear}`;
      }
    }
    
    // Enhanced keyword matching
    if (q.includes('wing') || q.includes('neighbor')) {
      return "**Wings** are the two types on either side of your main type that add flavor to your personality. For example:\n• Type 1 can have a 9 wing (1w9) or 2 wing (1w2)\n• Wings modify but don't change your core type";
    }
    
    if (q.includes('test') || q.includes('assessment') || q.includes('quiz') || q.includes('find my type') || q.includes('personality')) {
      return "You can discover your Enneagram type by taking our comprehensive assessment! It's designed by personality experts and available in the **Assessment** section. The test analyzes your motivations and fears to identify your core type.";
    }
    
    if (q.includes('community') || q.includes('join') || q.includes('chat') || q.includes('socialize') || q.includes('connect') || q.includes('rooms')) {
      return "You can join our **Community** section to chat with others who share your Enneagram journey! Connect with people of your type or explore different perspectives. Look for the Community/Rooms section in the navigation to start chatting and socializing with fellow Enneagram enthusiasts.";
    }
    
    if ((q.includes('subtype') || q.includes('instinct') || q.includes('sp') || q.includes('so') || q.includes('sx')) && !q.includes('chat') && !q.includes('socialize')) {
      return "**Instinctual Subtypes** add another layer to your type:\n\n• **Self-Preservation (SP):** Focus on safety, comfort, and resources\n• **Social (SO):** Focus on group dynamics and belonging\n• **Sexual/One-to-One (SX):** Focus on intensity and connection\n\nEach type expresses differently based on their dominant subtype.";
    }
    
    if (q.includes('growth') || q.includes('integration') || q.includes('healthy')) {
      return "**Growth (Integration)** happens when you move toward your integration point - the healthy aspects of another type. This represents your path to psychological health and personal development.";
    }
    
    if (q.includes('stress') || q.includes('disintegration') || q.includes('unhealthy')) {
      return "**Stress (Disintegration)** occurs when you move toward your disintegration point - taking on the unhealthy aspects of another type. Recognizing this helps you manage stress better.";
    }
    
    if (q.includes('center') || q.includes('triad')) {
      return "The Enneagram has **three centers:**\n\n• **Body/Gut (8,9,1):** Focus on control and autonomy\n• **Heart/Feeling (2,3,4):** Focus on identity and image\n• **Head/Thinking (5,6,7):** Focus on security and certainty\n\nEach center has a different way of processing the world.";
    }
    
    // Search FAQ more flexibly
    for (const faq of enneagramFAQ.general) {
      const faqWords = faq.question.toLowerCase().split(' ');
      const questionWords = q.split(' ');
      if (questionWords.some(word => faqWords.some(faqWord => faqWord.includes(word) && word.length > 2))) {
        return faq.answer;
      }
    }
    
    // Enhanced fallback responses
    const fallbacks = [
      "I'm not quite sure about that. Could you be more specific? You can ask about:\n• Specific types (1-9)\n• Wings and subtypes\n• Taking the assessment\n• Growth and stress patterns",
      "That's an interesting question! I specialize in Enneagram topics. Try asking about personality types, wings, or how to discover your type through our assessment.",
      "I'd love to help, but I need a bit more context. Feel free to ask about any of the 9 Enneagram types, personality development, or how the system works!"
    ];
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };
    
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: findAnswer(input),
      isBot: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage, botResponse]);
    setInput("");
    setShowSuggestions(false);
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full btn-typecircle shadow-lg z-50 !bg-[var(--typecircle-green)] !opacity-100"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}
      
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border/30">
            <h3 className="font-semibold text-foreground">FAQ Assistant</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.isBot
                      ? 'bg-muted/50 text-foreground'
                      : 'bg-[var(--typecircle-green)] text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            
            {showSuggestions && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground text-center">Try asking:</p>
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
          </div>
          
          <div className="p-4 border-t border-border/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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