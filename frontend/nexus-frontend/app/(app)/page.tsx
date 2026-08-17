'use client'

import { HealthCheck } from "@/lib/api/Health";
import Navbar from "@/components/navigation/NavBar";

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
