import { useState } from "react";
import { HomePage } from "./pages/HomePage";
import { GamePage } from "./pages/GamePage";
import { Footer } from "./components/Footer";

export default function App() {
  const [openId, setOpenId] = useState(null);

  return (
    <main className="page">
      {openId ? (
        <GamePage id={openId} onBack={() => setOpenId(null)} />
      ) : (
        <HomePage onSelectGame={setOpenId} />
      )}
      <Footer />
    </main>
  );
}