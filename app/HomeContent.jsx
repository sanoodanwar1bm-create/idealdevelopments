"use client";

import { useState } from "react";
import Navbar from "@components/Navbar";
import Preloader from "@components/Preloader";
import Hero from "@components/Hero";
import Marquee from "@components/Marquee";
import Process from "@components/Process";
import Services from "@components/Services";
import WhyChooseUs from "@components/WhyChooseUs";
import Projects from "@components/Projects";
import HomeTours from "@components/HomeTours";
import Values from "@components/Values";
import Faq from "@components/Faq";
import CallToAction from "@components/CallToAction";

export default function HomeContent() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <Preloader onDone={() => setIntroDone(true)} />
      <Navbar />
      <Hero start={introDone} />
      <Marquee />
      <Process />
      <Services />
      <WhyChooseUs />
      <Projects />
      <HomeTours />
      <Values />
      <Faq />
      <CallToAction />
    </>
  );
}
