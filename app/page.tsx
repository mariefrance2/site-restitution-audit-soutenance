import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { OverviewDashboard } from "@/components/sections/OverviewDashboard";
import { TestResults } from "@/components/sections/TestResults";
import { BilanDashboard } from "@/components/sections/BilanDashboard";
import { ConsequencesDashboard } from "@/components/sections/ConsequencesDashboard";
import { ValueAndReports } from "@/components/sections/ValueAndReports";
import { AgentTestsDashboard } from "@/components/sections/AgentTestsDashboard";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <OverviewDashboard />
        <TestResults />
        <BilanDashboard />
        <ConsequencesDashboard />
        <ValueAndReports />
        <AgentTestsDashboard />
      </main>
      <Footer />
    </>
  );
}
