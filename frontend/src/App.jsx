import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Statistics from "./components/Statistics";
import Features from "./components/Features";
import About from "./components/About";
import Footer from "./components/Footer";
import Login from "./components/login";
import Signup from "./components/signup";
import "./App.css";

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

  if (pathname === "/login") {
    return <Login />;
  }

  if (pathname === "/signup") {
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
