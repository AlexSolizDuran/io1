"use client";

import ProgLineal from "@/components/ProgLineal";
import Footer from "@/components/footer";
export default function Home() {
  return (
    
    <div className="flex flex-col min-h-screen w-full bg-[#dfdfe0]" >
      <main className="flex-grow w-full p-4">
        <ProgLineal />
      </main>
      <Footer />
    </div>
  );
}
