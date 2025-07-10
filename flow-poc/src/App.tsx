import { useState } from "react";
import "./App.css";

import { ReportViz } from "./components/reportViz";

function App() {
  const [userComboValue, setUserComboValue] = useState<string>("adam");

  const parseUserFilter = async (user?: string) => {
    if (user !== undefined) {
      setUserComboValue(user);
    }
  };

  return (
    <div style={{ minWidth: "1200px" }}>
      <h1>Tableau embed POC</h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <span style={{ fontWeight: "bold", paddingTop: "10px" }}>User:</span>
        <select
          style={{ marginTop: "12px", marginBottom: "9px", padding: "2px" }}
          defaultValue=""
          onChange={(event) => {
            console.log("User changed:", event.target.value);
            parseUserFilter(event.target.value);
          }}
        >
          <option value="adam" defaultChecked={userComboValue === "adam"}>
            Adam
          </option>
          <option value="eva" defaultChecked={userComboValue === "eva"}>
            Eva
          </option>
        </select>
      </div>
      <ReportViz user={userComboValue} />
    </div>
  );
}

export default App;
