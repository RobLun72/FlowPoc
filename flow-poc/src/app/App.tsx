import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { AppContextProvider } from "./AppContextProvider";

function App() {
  return (
    <AppContextProvider>
      <div className="bg-white w-fit md:min-w-7xl">
        <Router>
          <AppLayout />
        </Router>
      </div>
    </AppContextProvider>
  );
}

export default App;
