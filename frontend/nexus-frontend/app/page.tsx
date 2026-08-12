'use client'

import { HealthCheck } from "@/lib/health";
import { useEffect } from "react";

export default function Home() {
  const handleClick = () => {
    HealthCheck()
  }

  return (
    <>
      <h1>
        Nexus WebApp
      </h1>

      <button onClick={handleClick}>Heatlh Check</button>
    </>
  ); 
}
