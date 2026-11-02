"use client";

import React, { useEffect, useRef, useState } from "react";
import { montserrat } from "@lib/font";
import "./Title.css"; // You’ll need to create this CSS file (see below)

const Title = ({
  title,
  classes = "",
  delay = 0.3,
  duration = 0.8,
  underline = true,
  shadow = true,
  gradient = true,
}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`title-wrapper relative inline-block ${classes} ${
        inView ? "animate-title" : ""
      }`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      <h2
        className={`text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight ${
          montserrat.className
        } ${
          gradient
            ? "bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary2)] to-[var(--color-primary1)]"
            : "text-[var(--color-primary1)]"
        } ${shadow ? "drop-shadow-lg" : ""}`}
      >
        {title}
        {underline && (
          <span
            className={`absolute left-0 -bottom-2 w-full h-1 bg-[var(--color-accent)] origin-left underline-bar ${
              inView ? "scale-x-100" : ""
            }`}
            style={{
              transition: `transform ${duration * 0.8}s ${
                delay + 0.2
              }s cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
            }}
          />
        )}
      </h2>

      {shadow && (
        <span
          className={`absolute -z-10 text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-gray-400/20 -bottom-3 left-0 w-full shadow-title ${
            inView ? "opacity-20 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{
            transition: `opacity ${duration * 1.2}s ${
              delay + 0.1
            }s ease, transform ${duration * 1.2}s ${delay + 0.1}s ease`,
          }}
          aria-hidden="true"
        >
          {title}
        </span>
      )}
    </div>
  );
};

export default Title;
