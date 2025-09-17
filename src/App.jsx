import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar";
import ScrollToTop from "./components/ScrollToTop"; // 1. Import the component

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {<ScrollToTop />}
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}