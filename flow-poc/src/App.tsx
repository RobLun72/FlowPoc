import { useState } from "react";
import "./App.css";

import { ReportViz } from "./components/reportViz";
import { ReportViz2 } from "./components/reportViz2";

function App() {
  const [userComboValue, setUserComboValue] = useState<string>("adam");
  const [reportToShow, setReportToShow] = useState<string>("report1");

  const parseUserFilter = async (user?: string) => {
    if (user !== undefined) {
      setUserComboValue(user);
    }
  };

  const onPageShow = (reportName: string) => async () => {
    setReportToShow(reportName);
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
        <button
          onClick={onPageShow("report1")}
          style={{
            marginLeft: "20px",
            background: "#4CAF50",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Report using vizFilter
        </button>
        <button
          onClick={onPageShow("report2")}
          style={{
            marginLeft: "20px",
            background: "#4CAF50",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Report using custom view
        </button>
      </div>

      {reportToShow === "report1" && <ReportViz user={userComboValue} />}
      <div style={{ marginTop: "20px" }} />
      {reportToShow === "report2" && <ReportViz2 user={userComboValue} />}
      <div style={{ marginTop: "20px" }} />
    </div>
  );
}

export default App;
