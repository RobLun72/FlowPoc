import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { AppContextProvider } from "./AppContextProvider";

function App() {
  return (
    <AppContextProvider>
      <div style={{ minWidth: "1200px" }}>
        <Router>
          <AppLayout />
        </Router>
      </div>
    </AppContextProvider>
  );
}

export default App;
