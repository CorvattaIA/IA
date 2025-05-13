"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type MessageType = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

type UserInfo = {
  name: string | null;
  email: string | null;
  consultationReason: string | null;
};

// Questions to ask in order
const QUESTIONS = [
  "Hello! I'm the AI assistant for ética IA. What's your name?",
  "Nice to meet you, {name}! What's your email address so we can follow up with you?",
  "Thank you! Could you briefly explain why you're seeking AI ethics consultation today?",
  "Thanks for sharing that information. Our team specializes in ethical AI implementation. Do you have any specific questions about our services?",
];

// Regex patterns for information extraction
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
const NAME_REGEX = /(?:^|\s)(?:my name is|i am|i'm|this is|it's|call me)?\s*([A-Za-z]+(?: [A-Za-z]+)?)/i;

export function ChatInterface() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: null,
    email: null,
    consultationReason: null,
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [conversationStarted, setConversationStarted] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Start conversation with initial bot message
  useEffect(() => {
    if (!conversationStarted) {
      setConversationStarted(true);
      simulateBotReply(QUESTIONS[0]);
    }
  }, [conversationStarted]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    
    // Process user input
    processUserInput(inputValue);
  };

  const processUserInput = (input: string) => {
    // Extract information based on current question
    if (currentQuestionIndex === 0) {
      // Extract name
      const nameMatch = input.match(NAME_REGEX);
      if (nameMatch && nameMatch[1]) {
        const extractedName = nameMatch[1].trim();
        setUserInfo((prev) => ({ ...prev, name: extractedName }));
      } else {
        // If no name pattern detected, use the whole input as name
        setUserInfo((prev) => ({ ...prev, name: input.trim() }));
      }
      
      // Move to next question
      setCurrentQuestionIndex(1);
      
      // Format next question with name
      const nextQuestion = QUESTIONS[1].replace(
        "{name}", 
        userInfo.name || input.trim()
      );
      
      simulateBotReply(nextQuestion);
    } 
    else if (currentQuestionIndex === 1) {
      // Extract email
      const emailMatch = input.match(EMAIL_REGEX);
      if (emailMatch) {
        setUserInfo((prev) => ({ ...prev, email: emailMatch[0] }));
      } else {
        setUserInfo((prev) => ({ ...prev, email: input.trim() }));
      }
      
      // Move to next question
      setCurrentQuestionIndex(2);
      simulateBotReply(QUESTIONS[2]);
    } 
    else if (currentQuestionIndex === 2) {
      // Store consultation reason
      setUserInfo((prev) => ({ ...prev, consultationReason: input.trim() }));
      
      // Move to next question
      setCurrentQuestionIndex(3);
      simulateBotReply(QUESTIONS[3]);
    } 
    else {
      // Handle general conversation after initial questions
      handleGeneralConversation(input);
    }
  };

  const handleGeneralConversation = (input: string) => {
    // Simple response logic for demonstration
    const lowercaseInput = input.toLowerCase();
    
    if (lowercaseInput.includes("pricing") || lowercaseInput.includes("cost")) {
      simulateBotReply("Our pricing depends on the scope of your project. We offer customized packages starting from €2,000 for initial assessments. Would you like our team to contact you with a detailed quote?");
    } 
    else if (lowercaseInput.includes("time") || lowercaseInput.includes("duration") || lowercaseInput.includes("how long")) {
      simulateBotReply("Most of our consultations take between 2-4 weeks depending on the complexity of your AI system. We can provide a more accurate timeline after an initial assessment.");
    } 
    else if (lowercaseInput.includes("thank")) {
      simulateBotReply(`You're welcome, ${userInfo.name || 'there'}! Is there anything else you'd like to know about our ethical AI consultancy services?`);
    } 
    else {
      simulateBotReply(`Thank you for your question. Our team of ethical AI experts will review your inquiry about "${input.trim()}" and get back to you at ${userInfo.email}. Is there anything specific you'd like us to address when we contact you?`);
    }
  };

  const simulateBotReply = (content: string) => {
    setIsTyping(true);
    
    // Simulate typing delay
    setTimeout(() => {
      const botMessage: MessageType = {
        id: Date.now().toString(),
        content,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="text-2xl font-bold mb-4 text-center">
        <span className="text-primary">ética</span> IA Chat Assistant
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-[500px] overflow-y-auto p-4 rounded-lg bg-muted/30 mb-4 border border-border"
        ref={chatContainerRef}
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-lg max-w-[80%] mb-2 ${
                message.sender === "user" 
                  ? "bg-primary text-primary-foreground ml-auto" 
                  : "bg-secondary text-secondary-foreground mr-auto"
              }`}
            >
              <div className="flex items-start gap-2">
                {message.sender === "user" ? (
                  <User className="h-5 w-5 mt-1 flex-shrink-0" />
                ) : (
                  <Bot className="h-5 w-5 mt-1 flex-shrink-0" />
                )}
                <div>{message.content}</div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-lg max-w-[80%] mb-2 bg-secondary text-secondary-foreground mr-auto"
            >
              <div className="flex space-x-1 items-center">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "200ms" }}></span>
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "400ms" }}></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder="Type your message..."
          disabled={isTyping}
          className="flex-1 p-3 rounded-lg border border-input bg-background"
        />
        <button 
          onClick={handleSendMessage}
          disabled={isTyping || !inputValue.trim()}
          className={`p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors ${
            (!inputValue.trim() || isTyping) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}