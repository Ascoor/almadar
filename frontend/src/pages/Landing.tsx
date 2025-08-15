import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const nav = useNavigate();
  return (
    <div className="relative min-h-[calc(100vh-0px)] overflow-hidden flex items-center justify-center">
      {/* gradient bg glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "var(--gradient-hero)"
      }} />
      {/* floating shapes */}
      <motion.div
        className="absolute -top-24 -start-24 w-96 h-96 rounded-full blur-3xl opacity-20 bg-accent"
        animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }} transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-24 -end-24 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-20 bg-primary-light"
        animate={{ y: [0, -20, 0], scale: [1, 1.03, 1] }} transition={{ duration: 9, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center space-y-6"
        dir="rtl"
      >
        <h1 className="text-4xl md:text-5xl font-bold gradient-text">تطبيق إدارة الشؤون القانونية</h1>
        <p className="text-lg text-muted-foreground">منصة احترافية لإدارة التعاقدات والتقاضي والمشورة القانونية</p>
        <button
          onClick={() => nav("/login")}
          className="btn-hero focus-ring"
        >
          🚀 تسجيل الدخول
        </button>
      </motion.div>
    </div>
  );
}
