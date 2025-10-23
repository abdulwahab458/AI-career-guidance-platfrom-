"use client";
import Link from "next/link";
import React, { useRef } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

const Hero = () => {
  const imageref = useRef(null);

  // track scroll progress relative to the image container
  const { scrollYProgress } = useScroll({
    target: imageref,
    offset: ["start end", "end start"], // starts when image enters viewport
  });

  // useTransform maps scroll progress to motion values
  const y = useTransform(scrollYProgress, [0, 1], ["-50px", "50px"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 0.95]);
  const rotateX = useTransform(scrollYProgress, [0, 1], ["10deg", "-20deg"]);
  const rotateY = useTransform(scrollYProgress, [0, 1], ["-10deg", "15deg"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  return (
    <section className="relative z-10 flex flex-col items-center text-center py-15">
      {/* Main hero content */}
      <div className="relative z-20 flex flex-col items-center">
        <h1 className="bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-4 text-4xl font-extrabold text-transparent sm:text-7xl">
          AI Powered Career Guidance Platform
        </h1>

        <p className="bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-2 text-3xl font-bold text-transparent max-w-3xl">
          “Your future isn’t written by chance, it’s coded by choice. Let AI help you choose smarter.”
        </p>

        <div className="py-4 gap-3 flex">
          <Link href="/dashboard">
            <Button className="z-30 ">Get Started</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="z-30 " variant="outline">
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* Floating image with 3D scroll effect */}
      <div className="z-20 mt-10 perspective-[1000px]">
        <motion.div
          ref={imageref}
          style={{ y, scale, rotateX, rotateY, opacity }}
          className="will-change-transform"
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        >
          <Image
            src={"/aiimg.png"}
            width={1200}
            height={720}
            alt="banner"
            className="rounded-2xl shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
