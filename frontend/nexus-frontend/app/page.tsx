'use client'

import { HealthCheck } from "@/lib/Health";
import Navbar from "@/components/NavBar";

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

      <Navbar></Navbar>
    </>
  ); 
}
