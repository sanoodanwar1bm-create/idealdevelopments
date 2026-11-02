"use client";
import { motion } from "motion/react";
import { useRef } from "react";

export default function Title({
  title,
  shadow = false,
  gradient = false,
  centered = true,
}) {
  const titleRef = useRef(null);

  return (
    <motion.div
      ref={titleRef}
      className={`relative ${centered ? "text-center" : "text-left"} mb-6`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h2
        className={`text-4xl md:text-5xl lg:text-6xl font-bold font-title relative inline-block`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        {/* Main Title with Gradient/Shadow Effects */}
        <span
          className={`relative z-10 ${
            gradient
              ? "bg-gradient-to-r from-primary to-teal bg-clip-text text-transparent"
              : "text-primary"
          } ${shadow ? "drop-shadow-lg" : ""}`}
        >
          {title}
        </span>

        {/* Background Text Effect */}
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.03, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute inset-0 text-5xl md:text-6xl lg:text-7xl font-black text-primary whitespace-nowrap"
          style={{ zIndex: 0 }}
        >
          {title}
        </motion.span>

        {/* Animated Underline */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="h-1 bg-gradient-to-r from-accent to-teal rounded-full mt-4"
        />
      </motion.h2>
    </motion.div>
  );
}
