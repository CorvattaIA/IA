"use client";

import { motion } from "framer-motion";
import { ArrowRight, Brain, Shield, Users, Lightbulb } from "lucide-react";
import { useInView } from "react-intersection-observer";

const HeroSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden pt-20"
    >
      {/* Background with parallax effect */}
      <div className="absolute inset-0 -z-10 parallax-bg noma-bar-bg"></div>
      
      {/* Geometric shapes for Noma Bar style */}
      <div className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-primary/10 -z-10"></div>
      <div className="absolute bottom-1/4 right-10 w-48 h-48 rounded-full bg-secondary/10 -z-10"></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-primary/5 rotate-45 -z-10"></div>

      <div className="container">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-shadow"
          >
            Consultoría en Ética para{" "}
            <span className="text-primary">Inteligencia Artificial</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground mb-8"
          >
            Ofrecemos soluciones integrales para la implementación ética de la IA, 
            adaptadas a las necesidades de cada sector económico, garantizando el uso 
            responsable y seguro de la inteligencia artificial en las organizaciones.
          </motion.p>

          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const testSection = document.getElementById("test");
                if (testSection) {
                  window.scrollTo({
                    top: testSection.offsetTop - 80,
                    behavior: "smooth",
                  });
                }
              }}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              Realiza tu diagnóstico
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            {[
              {
                icon: <Shield className="w-8 h-8 text-primary" />,
                title: "Seguridad",
                description: "Implementación segura de sistemas de IA en su organización",
              },
              {
                icon: <Users className="w-8 h-8 text-primary" />,
                title: "Responsabilidad",
                description: "Garantizamos prácticas éticas y responsables en el uso de IA",
              },
              {
                icon: <Lightbulb className="w-8 h-8 text-primary" />,
                title: "Innovación",
                description: "Soluciones innovadoras adaptadas a cada sector económico",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="service-card"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;