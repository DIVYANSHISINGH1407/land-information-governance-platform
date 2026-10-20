import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Statistics from "./components/Statistics";
import Features from "./components/Features";
import About from "./components/About";
import Footer from "./components/Footer";
import Signup from "./components/signup";
import "./App.css";

function App() {
  if (window.location.pathname.replace(/\/+$/, "") === "/signup") {
    return <Signup />;
  }

  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <Statistics />
        <Features />
        <About />
      </main>
      <Footer />
    </div>
  );
}

export default App;
