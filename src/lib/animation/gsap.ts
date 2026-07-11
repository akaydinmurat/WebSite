"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let pluginsRegistered = false;

if (typeof window !== "undefined" && !pluginsRegistered) {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
  pluginsRegistered = true;
}

export { gsap, ScrollTrigger, useGSAP };
