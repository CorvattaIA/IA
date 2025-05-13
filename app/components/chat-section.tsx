"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Send, User, Bot, Loader2, RefreshCw } from "lucide-react";

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
};

type ConversationStage = 
  | "greeting" 
  | "needDetection" 
  | "solutionPresentation" 
  | "valueDemo" 
  | "callToAction" 
  | "specificServices" 
  | "meetingClosure" 
  | "farewell"
  | "completed";

type ClientInfo = {
  name: string;
  companyName: string;
  email: string;
  sector: string;
  challenges: string[];
};

const ChatSection = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sector, setSector] = useState("");
  const [companyName, setCompanyName] = useState("");
  
  // Conversation flow control
  const [conversationStage, setConversationStage] = useState<ConversationStage>("greeting");
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: "",
    companyName: "",
    email: "",
    sector: "",
    challenges: []
  });
  const [detectedChallenges, setDetectedChallenges] = useState<string[]>([]);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [conversationEnding, setConversationEnding] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  // Initialize with a greeting when the component mounts
  useEffect(() => {
    const initialGreeting = getStageResponse("greeting");
    setMessages([
      {
        id: "welcome",
        content: initialGreeting,
        sender: "bot",
      }
    ]);
  }, []);

  // Update client info when user info is submitted
  useEffect(() => {
    if (!showUserInfo && name && email && sector) {
      setClientInfo(prev => ({
        ...prev,
        name,
        email,
        sector
      }));
    }
  }, [showUserInfo, name, email, sector]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Function to get response based on conversation stage
  const getStageResponse = (stage: ConversationStage): string => {
    const { name, companyName, sector, challenges } = clientInfo;
    
    switch (stage) {
      case "greeting":
        return "¡Hola! Soy el Agente de Ética en IA de ética IA. Estoy aquí para ayudarte a implementar soluciones de IA éticas y responsables en tu organización. ¿Podrías contarme un poco sobre tu empresa y los desafíos que enfrentan con la inteligencia artificial?";
      
      case "needDetection":
        return `Gracias ${name} por compartir esa información sobre ${companyName || "tu empresa"}. Para entender mejor cómo podemos ayudarte, me gustaría conocer más sobre los desafíos específicos que enfrentan en la implementación ética de IA. ¿Podrías mencionar alguna preocupación particular relacionada con transparencia, equidad, privacidad o cumplimiento normativo en sus sistemas de IA?`;
      
      case "solutionPresentation":
        return `Basado en lo que me has contado sobre ${companyName || "tu empresa"} y los desafíos que enfrentan en el sector ${sector}, puedo recomendarte nuestros servicios de consultoría en ética de IA. Ofrecemos cuatro servicios principales:\n\n1. Diagnóstico de Riesgos Éticos: Evaluamos tus sistemas actuales para identificar vulnerabilidades éticas.\n2. Diseño de Estrategias Éticas: Desarrollamos marcos y políticas adaptadas a tu sector y necesidades.\n3. Análisis Ético de la IA: Examinamos algoritmos y procesos para garantizar transparencia y equidad.\n4. Capacitación en Ética para IA: Formamos a tu equipo en principios y prácticas éticas.\n\n¿Alguno de estos servicios te resulta particularmente interesante para los desafíos que me has mencionado?`;
      
      case "valueDemo":
        const challengeText = challenges.length > 0 
          ? `los desafíos que has mencionado como ${challenges.join(", ")}` 
          : "los desafíos típicos del sector";
        
        return `Hemos trabajado con varias organizaciones del sector ${sector} que enfrentaban ${challengeText}. Por ejemplo, ayudamos a una empresa similar a implementar un marco ético que no solo mitigó riesgos regulatorios, sino que también mejoró la confianza de sus clientes y optimizó sus procesos de desarrollo de IA.\n\nNuestros clientes suelen ver beneficios como:\n\n• Reducción de riesgos legales y reputacionales\n• Mayor confianza de usuarios y stakeholders\n• Mejora en la calidad y precisión de sus sistemas de IA\n• Procesos de desarrollo más eficientes y sostenibles\n\n¿Qué beneficios serían más valiosos para ${companyName || "tu organización"} en este momento?`;
      
      case "callToAction":
        return `Me gustaría proponerte agendar una reunión con uno de nuestros consultores especializados en el sector ${sector}. En esta sesión gratuita de 30 minutos, podrán profundizar en los desafíos específicos de ${companyName || "tu empresa"} y diseñar un enfoque personalizado.\n\n¿Te parece bien agendar esta reunión? Podemos adaptarnos a tu disponibilidad en los próximos días.`;
      
      case "specificServices":
        return `Claro, puedo darte más detalles sobre nuestros servicios. ¿Hay alguno en particular sobre el que te gustaría saber más? Podemos hablar sobre el Diagnóstico de Riesgos Éticos, el Diseño de Estrategias Éticas, el Análisis Ético de la IA o la Capacitación en Ética para IA.`;
      
      case "meetingClosure":
        return `Excelente, tomaré nota de tu interés en agendar una reunión. Uno de nuestros consultores se pondrá en contacto contigo a través de tu correo ${email} en las próximas 24 horas para coordinar la fecha y hora que mejor te convenga.\n\n¿Hay algo más que te gustaría saber sobre nuestros servicios o sobre cómo podemos ayudarte con la implementación ética de IA en ${companyName || "tu empresa"}?`;
      
      case "farewell":
        return `Ha sido un placer conversar contigo, ${name}. Agradezco tu interés en nuestros servicios de consultoría en ética de IA. Estaremos en contacto pronto a través de tu correo ${email} para coordinar los próximos pasos.\n\nMientras tanto, si tienes alguna otra pregunta, no dudes en contactarnos. ¡Que tengas un excelente día!`;
      
      case "completed":
        return `Gracias por tu tiempo, ${name}. Si deseas iniciar una nueva conversación, puedes hacer clic en el botón de reinicio en la parte superior derecha. ¡Hasta pronto!`;
      
      default:
        return "Entiendo. ¿Hay algo más en lo que pueda ayudarte sobre nuestros servicios de consultoría en ética de IA?";
    }
  };

  // Function to detect challenges from user input
  const detectChallenges = (input: string): string[] => {
    const lowercaseInput = input.toLowerCase();
    const challenges: string[] = [];
    
    const challengePatterns = [
      { pattern: /sesgo|discrimina|equidad|justo|just/g, challenge: "sesgos algorítmicos" },
      { pattern: /privacidad|datos personales|confidencial/g, challenge: "privacidad de datos" },
      { pattern: /transparen|explicab|caja negra|entend/g, challenge: "transparencia algorítmica" },
      { pattern: /regula|norma|ley|cumplimiento|legal/g, challenge: "cumplimiento normativo" },
      { pattern: /seguridad|vulnerab|ataque|robusto/g, challenge: "seguridad y robustez" },
      { pattern: /responsab|supervis|human|control/g, challenge: "supervisión humana" },
      { pattern: /confian|reputación|imagen|stakeholder/g, challenge: "confianza y reputación" },
      { pattern: /implement|integr|adopción|cambio/g, challenge: "implementación y adopción" }
    ];
    
    for (const { pattern, challenge } of challengePatterns) {
      if (pattern.test(lowercaseInput) && !challenges.includes(challenge)) {
        challenges.push(challenge);
      }
    }
    
    // Extract company name if mentioned
    const companyPatterns = [
      /nuestra empresa (?:se llama|es) ([A-Za-z0-9\s]+)/i,
      /trabajo(?:mos)? (?:en|para) ([A-Za-z0-9\s]+)/i,
      /(?:en|de) ([A-Za-z0-9\s]+) estamos/i
    ];
    
    for (const pattern of companyPatterns) {
      const match = input.match(pattern);
      if (match && match[1]) {
        const company = match[1].trim();
        if (company.length > 2 && company.length < 30) {
          setClientInfo(prev => ({
            ...prev,
            companyName: company
          }));
          break;
        }
      }
    }
    
    return challenges;
  };

  // Function to advance conversation stage
  const advanceConversationStage = (userInput: string): void => {
    const lowercaseInput = userInput.toLowerCase();
    
    // Detect challenges from user input
    const newChallenges = detectChallenges(userInput);
    if (newChallenges.length > 0) {
      // Fixed: Using Array.from to convert Set to array
      setDetectedChallenges(prev => {
        const uniqueChallenges = Array.from(new Set([...prev, ...newChallenges]));
        return uniqueChallenges;
      });
      
      setClientInfo(prev => ({
        ...prev,
        challenges: Array.from(new Set([...prev.challenges, ...newChallenges]))
      }));
    }
    
    switch (conversationStage) {
      case "greeting":
        setConversationStage("needDetection");
        break;
        
      case "needDetection":
        // If user has shared challenges or mentioned specific problems
        if (newChallenges.length > 0 || 
            /desafío|problema|preocupa|dificultad|reto/i.test(lowercaseInput)) {
          setConversationStage("solutionPresentation");
        } else {
          // Ask again more specifically if no challenges detected
          const followUpQuestion = "Para poder ayudarte mejor, ¿podrías contarme qué desafíos específicos enfrentan con la implementación de IA en tu organización? Por ejemplo, ¿les preocupa la transparencia de los algoritmos, los sesgos, la privacidad de datos o el cumplimiento normativo?";
          
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              content: followUpQuestion,
              sender: "bot"
            }]);
          }, 1000);
        }
        break;
        
      case "solutionPresentation":
        setConversationStage("valueDemo");
        break;
        
      case "valueDemo":
        setConversationStage("callToAction");
        break;
        
      case "callToAction":
        // Check if user is interested in meeting
        if (/sí|si|claro|ok|buena idea|me parece bien|adelante|agenda|reunión|reunir/i.test(lowercaseInput)) {
          setConversationStage("meetingClosure");
        } 
        // Check if user wants more info about services
        else if (/servicio|más detalles|más información|cuéntame más|explica/i.test(lowercaseInput)) {
          setConversationStage("specificServices");
        } 
        // If rejection, move to farewell
        else if (/no|después|luego|ahora no|otro momento|no estoy interesado/i.test(lowercaseInput)) {
          setConversationStage("farewell");
        }
        break;
        
      case "specificServices":
        // After providing service details, go back to call to action
        setConversationStage("callToAction");
        break;
        
      case "meetingClosure":
        setConversationStage("farewell");
        break;
        
      case "farewell":
        setConversationStage("completed");
        setConversationEnding(true);
        break;
        
      case "completed":
        // Conversation is complete, no further progression
        break;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || conversationEnding) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Save chat data to database
      await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          sector,
          message: input,
        }),
      });

      // Process user input and advance conversation
      advanceConversationStage(input);
      
      // Simulate API delay for realism
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Get response based on current stage
      const botResponse = getStageResponse(conversationStage);

      const botMessageObj: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
      };
      
      setMessages((prev) => [...prev, botMessageObj]);
      
      // If conversation is ending, disable input
      if (conversationStage === "completed") {
        setConversationEnding(true);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, intenta nuevamente más tarde.",
        sender: "bot",
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = () => {
    if (!name || !email || !sector) return;
    setShowUserInfo(false);
    
    // Update client info
    setClientInfo(prev => ({
      ...prev,
      name,
      email,
      sector
    }));
  };

  const resetChat = () => {
    const initialGreeting = getStageResponse("greeting");
    setMessages([
      {
        id: "welcome",
        content: initialGreeting,
        sender: "bot",
      }
    ]);
    setConversationStage("greeting");
    setDetectedChallenges([]);
    setAskedQuestions([]);
    setConversationEnding(false);
    setClientInfo({
      name,
      companyName: "",
      email,
      sector,
      challenges: []
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section
      id="chat"
      ref={ref}
      className="min-h-screen py-20 bg-card relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-card to-transparent -z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-card to-transparent -z-10"></div>
      <div className="absolute top-1/4 right-10 w-40 h-40 rounded-full bg-primary/5 -z-10"></div>
      <div className="absolute bottom-1/3 left-10 w-60 h-60 rounded-full bg-secondary/5 -z-10"></div>

      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-3xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Chat Inteligente
            </h2>
            <p className="text-muted-foreground">
              Conversa con nuestro asistente virtual para resolver tus dudas sobre ética en IA y agendar reuniones con nuestro equipo.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-background rounded-lg shadow-lg border border-border overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {showUserInfo ? (
                <motion.div
                  key="user-info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-8"
                >
                  <h3 className="text-xl font-semibold mb-6">Antes de comenzar</h3>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Nombre
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium mb-1">
                        Nombre de la empresa
                      </label>
                      <input
                        id="companyName"
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Nombre de tu empresa"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Correo electrónico
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Tu correo electrónico"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="sector" className="block text-sm font-medium mb-1">
                        Sector
                      </label>
                      <select
                        id="sector"
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="input-field"
                        required
                      >
                        <option value="">Selecciona un sector</option>
                        <option value="salud">Salud</option>
                        <option value="financiero">Financiero</option>
                        <option value="educativo">Educativo</option>
                        <option value="retail">Retail</option>
                        <option value="tecnologico">Tecnológico</option>
                        <option value="publico">Público</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartChat}
                    disabled={!name || !email || !sector}
                    className={`btn-primary w-full ${
                      !name || !email || !sector ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Comenzar chat
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-[600px]"
                >
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">Agente de Ética en IA</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetChat}
                      className="p-2 rounded-md hover:bg-muted transition-colors"
                      aria-label="Reiniciar chat"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </motion.button>
                  </div>
                  
                  <div className="flex-grow p-6 overflow-y-auto scrollbar-hide">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`chat-bubble ${
                          message.sender === "user" ? "chat-bubble-user" : "chat-bubble-bot"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {message.sender === "user" ? (
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-muted-foreground flex items-center justify-center">
                                <Bot className="w-4 h-4 text-background" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium mb-1">
                              {message.sender === "user" ? name : "Agente de Ética en IA"}
                            </div>
                            <div className="whitespace-pre-line">{message.content}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="chat-bubble chat-bubble-bot"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-8 h-8 rounded-full bg-muted-foreground flex items-center justify-center">
                              <Bot className="w-4 h-4 text-background" />
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            <span>Escribiendo...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder={conversationEnding ? "Conversación finalizada" : "Escribe tu mensaje..."}
                        className="input-field flex-grow"
                        disabled={isLoading || conversationEnding}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={!input.trim() || isLoading || conversationEnding}
                        className={`btn-primary p-3 ${
                          !input.trim() || isLoading || conversationEnding ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        aria-label="Enviar mensaje"
                      >
                        <Send className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChatSection;