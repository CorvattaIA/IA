"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  BookOpen, 
  BarChart, 
  Building, 
  Briefcase, 
  Stethoscope, 
  GraduationCap, 
  ShoppingBag, 
  Cpu, 
  LandPlot
} from "lucide-react";

type Question = {
  id: string;
  question: string;
  options: {
    value: string | boolean;
    label: string;
  }[];
  type: "select" | "boolean";
};

type Service = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const sectors = [
  { value: "salud", label: "Salud", icon: <Stethoscope className="w-5 h-5" /> },
  { value: "financiero", label: "Financiero", icon: <Briefcase className="w-5 h-5" /> },
  { value: "educativo", label: "Educativo", icon: <GraduationCap className="w-5 h-5" /> },
  { value: "retail", label: "Retail", icon: <ShoppingBag className="w-5 h-5" /> },
  { value: "tecnologico", label: "Tecnológico", icon: <Cpu className="w-5 h-5" /> },
  { value: "publico", label: "Público", icon: <Building className="w-5 h-5" /> },
  { value: "otro", label: "Otro", icon: <LandPlot className="w-5 h-5" /> },
];

const questions: Question[] = [
  {
    id: "sector",
    question: "¿En qué sector económico opera tu organización?",
    options: sectors.map(sector => ({ value: sector.value, label: sector.label })),
    type: "select",
  },
  {
    id: "usesAI",
    question: "¿Tu empresa ya utiliza sistemas de IA en producción?",
    options: [
      { value: true, label: "Sí" },
      { value: false, label: "No" },
    ],
    type: "boolean",
  },
  {
    id: "concernLevel",
    question: "¿Te preocupa el impacto social o legal de tus sistemas de IA?",
    options: [
      { value: "alto", label: "Mucho" },
      { value: "medio", label: "Moderadamente" },
      { value: "bajo", label: "Poco" },
      { value: "ninguno", label: "No me preocupa" },
    ],
    type: "select",
  },
  {
    id: "teamTrained",
    question: "¿Tu equipo ha recibido formación en ética de IA?",
    options: [
      { value: true, label: "Sí" },
      { value: false, label: "No" },
    ],
    type: "boolean",
  },
  {
    id: "maturityLevel",
    question: "¿Qué nivel de madurez tiene tu estrategia de IA?",
    options: [
      { value: "avanzado", label: "Avanzado - IA integrada en toda la organización" },
      { value: "intermedio", label: "Intermedio - Varios proyectos de IA en producción" },
      { value: "inicial", label: "Inicial - Primeros proyectos de IA" },
      { value: "exploratorio", label: "Exploratorio - Evaluando posibilidades" },
      { value: "ninguno", label: "Ninguno - Sin estrategia de IA" },
    ],
    type: "select",
  },
];

const services: Service[] = [
  {
    id: "diagnostico",
    title: "Diagnóstico de Riesgos Éticos",
    description: "Evaluación exhaustiva de los sistemas de IA existentes para identificar riesgos éticos potenciales y áreas de mejora.",
    icon: <AlertTriangle className="w-10 h-10 text-primary" />,
  },
  {
    id: "estrategia",
    title: "Diseño de Estrategias Éticas",
    description: "Desarrollo de marcos y políticas éticas adaptadas a las necesidades específicas de su organización y sector.",
    icon: <BarChart className="w-10 h-10 text-primary" />,
  },
  {
    id: "analisis",
    title: "Análisis Ético de la IA",
    description: "Evaluación detallada de algoritmos y sistemas de IA para garantizar transparencia, equidad y responsabilidad.",
    icon: <CheckCircle className="w-10 h-10 text-primary" />,
  },
  {
    id: "capacitacion",
    title: "Capacitación en Ética para IA",
    description: "Programas de formación para equipos técnicos y directivos sobre principios éticos en el desarrollo y uso de IA.",
    icon: <BookOpen className="w-10 h-10 text-primary" />,
  },
];

const DiagnosticTest = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState("");
  const [recommendedServices, setRecommendedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Calculate recommended services based on answers
      const recommended = calculateRecommendedServices();
      setRecommendedServices(recommended);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const calculateRecommendedServices = (): string[] => {
    const recommended: string[] = [];

    // Logic to determine recommended services based on answers
    if (answers.usesAI === true) {
      recommended.push("diagnostico");
      
      if (answers.concernLevel === "alto" || answers.concernLevel === "medio") {
        recommended.push("analisis");
      }
      
      if (answers.teamTrained === false) {
        recommended.push("capacitacion");
      }
      
      if (answers.maturityLevel === "avanzado" || answers.maturityLevel === "intermedio") {
        recommended.push("estrategia");
      }
    } else {
      // If not using AI yet
      if (answers.maturityLevel === "exploratorio" || answers.maturityLevel === "inicial") {
        recommended.push("estrategia");
        recommended.push("capacitacion");
      }
    }

    // Ensure at least one service is recommended
    if (recommended.length === 0) {
      recommended.push("diagnostico");
    }

    return recommended;
  };

  const handleSubmitResults = async () => {
    if (!email) return;

    setIsSubmitting(true);

    try {
      await fetch("/api/diagnostic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...answers,
          recommendedServices,
          email,
        }),
      });

      // Success message or redirect could be added here
    } catch (error) {
      console.error("Error submitting diagnostic results:", error);
    } finally {
      setIsSubmitting(false);
    }
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

  const currentQuestion = questions[currentStep];
  const isCurrentQuestionAnswered = answers[currentQuestion?.id] !== undefined;

  return (
    <section
      id="test"
      ref={ref}
      className="min-h-screen py-20 bg-background relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent -z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent -z-10"></div>
      <div className="absolute top-1/3 left-10 w-40 h-40 rounded-full bg-primary/5 -z-10"></div>
      <div className="absolute bottom-1/4 right-10 w-60 h-60 rounded-full bg-secondary/5 -z-10"></div>

      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-3xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Test de Diagnóstico
            </h2>
            <p className="text-muted-foreground">
              Responde estas preguntas para identificar los servicios de ética en IA que necesita tu organización.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-card rounded-lg shadow-lg border border-border p-8"
          >
            <AnimatePresence mode="wait">
              {!showResults ? (
                <motion.div
                  key="question"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-8">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Pregunta {currentStep + 1} de {questions.length}</span>
                      <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% completado</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: `${(currentStep / questions.length) * 100}%` }}
                        animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                        className="h-full bg-primary"
                      ></motion.div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>

                  <div className="space-y-3 mb-8">
                    {currentQuestion.options.map((option) => (
                      <motion.button
                        key={option.value.toString()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(currentQuestion.id, option.value)}
                        className={`w-full text-left p-4 rounded-md border transition-colors ${
                          answers[currentQuestion.id] === option.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                            answers[currentQuestion.id] === option.value
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground"
                          }`}>
                            {answers[currentQuestion.id] === option.value && (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </div>
                          <span>{option.label}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className={`flex items-center gap-2 btn-outline ${
                        currentStep === 0 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Anterior
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNext}
                      disabled={!isCurrentQuestionAnswered}
                      className={`flex items-center gap-2 btn-primary ${
                        !isCurrentQuestionAnswered ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {currentStep < questions.length - 1 ? "Siguiente" : "Ver resultados"}
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-semibold mb-6 text-center">Servicios recomendados</h3>
                  
                  <p className="text-muted-foreground mb-8 text-center">
                    Basado en tus respuestas, recomendamos los siguientes servicios para tu organización:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {services
                      .filter((service) => recommendedServices.includes(service.id))
                      .map((service) => (
                        <motion.div
                          key={service.id}
                          whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
                          className="bg-background rounded-lg p-6 border border-border"
                        >
                          <div className="mb-4">{service.icon}</div>
                          <h4 className="text-xl font-semibold mb-2">{service.title}</h4>
                          <p className="text-muted-foreground mb-4">{service.description}</p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              const chatSection = document.getElementById("chat");
                              if (chatSection) {
                                window.scrollTo({
                                  top: chatSection.offsetTop - 80,
                                  behavior: "smooth",
                                });
                              }
                            }}
                            className="btn-outline w-full"
                          >
                            Solicitar información
                          </motion.button>
                        </motion.div>
                      ))}
                  </div>

                  <div className="border-t border-border pt-6 mt-6">
                    <h4 className="text-lg font-semibold mb-4">Recibe un informe detallado</h4>
                    <p className="text-muted-foreground mb-4">
                      Ingresa tu correo electrónico para recibir un informe detallado con recomendaciones específicas para tu organización.
                    </p>
                    
                    <div className="flex gap-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Tu correo electrónico"
                        className="input-field flex-grow"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSubmitResults}
                        disabled={!email || isSubmitting}
                        className={`btn-primary whitespace-nowrap ${
                          !email || isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSubmitting ? "Enviando..." : "Recibir informe"}
                      </motion.button>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowResults(false);
                        setCurrentStep(0);
                        setAnswers({});
                      }}
                      className="flex items-center gap-2 btn-outline"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Reiniciar test
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const chatSection = document.getElementById("chat");
                        if (chatSection) {
                          window.scrollTo({
                            top: chatSection.offsetTop - 80,
                            behavior: "smooth",
                          });
                        }
                      }}
                      className="flex items-center gap-2 btn-primary"
                    >
                      Ir al chat
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
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

export default DiagnosticTest;