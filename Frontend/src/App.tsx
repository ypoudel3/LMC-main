import './input.css';
import './App.css';
import { useRef } from 'react';
import Body from '../component/Body.tsx';
import Body2 from '../component/Body2.jsx';
import SOS from '../component/SOS.jsx';
import Footer from '../component/Footer.jsx';
import Legal from "../component/Legal";
import Expense from "../component/Expense.jsx";
import ReportForm from "../component/ReportForm.jsx"; // no .js

function App() {
  // Get the current URL path
  const path = window.location.pathname;

  // If path is "/legal", render Legal.jsx as a separate page
  if (path === "/legal") return <Legal />;
  if (path === "/expense") return <Expense />;
  if (path === "/reportform") return <ReportForm />;

  // Otherwise, render the normal homepage layout
  const body2Ref = useRef<HTMLDivElement>(null);
  const scrollToBody2 = () => {
    body2Ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Main Body */}
      <Body scrollToBody2={scrollToBody2} />

      {/* Section to scroll to */}
      <div ref={body2Ref}>
        <Body2 />
      </div>

      {/* SOS Button Section */}
      <SOS />

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;
