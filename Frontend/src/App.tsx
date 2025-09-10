import './App.css';
import './input.css';
import { useRef } from "react";
import Body from "../component/Body";
import Body2 from "../component/Body2";
import SOS from "../component/SOS";
import Footer from "../component/Footer";
import Legal from "../component/Legal";
import Expense from "../component/Expense";
import ReportForm from "../component/ReportForm";
function App() {
  const path = window.location.pathname; // define path

  // Render specific pages based on path
  if (path === "/legal") return <Legal />;
  if (path === "/expense") return <Expense />;
  if (path === "/reportform") return <ReportForm />;

  // Refs for scrolling
  const body2Ref = useRef<HTMLDivElement>(null);
  const scrollToBody2 = () => {
    body2Ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>    
      <Body scrollToBody2={scrollToBody2} />

      <div ref={body2Ref}>
        <Body2 />
      </div>

      <SOS />
      <Footer />

    </>
  );
}

export default App;
