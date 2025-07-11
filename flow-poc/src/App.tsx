import { useEffect, useState } from "react";
import "./App.css";

import { ReportViz } from "./components/reportViz";
import { ReportViz2 } from "./components/reportViz2";

interface AppState {
  load: boolean;
  message: string;
  jwt: string;
  userComboValue: string;
  reportToShow: string;
}

interface jwtResponse {
  message: string;
  jwtToken: string;
}

function App() {
  const [pageState, setPageState] = useState<AppState>({
    load: true,
    message: "",
    jwt: "",
    userComboValue: "adam",
    reportToShow: "report1",
  });

  useEffect(() => {
    async function getData(api: string) {
      const data = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          report: pageState.reportToShow,
          user: pageState.userComboValue,
        }),
      });
      const result: jwtResponse = await data.json();
      setPageState({
        ...pageState,
        load: false,
        message: result.message,
        jwt: result.jwtToken,
      });
    }

    if (pageState.load) {
      getData("http://localhost:5174/api/tableau/jwt");
    }
  }, [pageState.load, pageState]);

  const parseUserFilter = async (user?: string) => {
    if (user !== undefined) {
      setPageState((prev) => ({ ...prev, userComboValue: user }));
    }
  };

  const onPageShow = (reportName: string) => async () => {
    setPageState((prev) => ({ ...prev, reportToShow: reportName }));
  };

  return (
    <div style={{ minWidth: "1200px" }}>
      <h1>Tableau embed POC</h1>
      {pageState.message !== "" && (
        <div>
          <div style={{ marginBottom: "20px" }}>
            <span style={{ fontWeight: "bold" }}>Message from server:</span>{" "}
            <span>{pageState.message}</span>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <span style={{ fontWeight: "bold" }}>JWT:</span>{" "}
            <span style={{ wordBreak: "break-all" }}>{pageState.jwt}</span>
          </div>
        </div>
      )}
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
          <option
            value="adam"
            defaultChecked={pageState.userComboValue === "adam"}
          >
            Adam
          </option>
          <option
            value="eva"
            defaultChecked={pageState.userComboValue === "eva"}
          >
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

      {pageState.reportToShow === "report1" && (
        <ReportViz user={pageState.userComboValue} />
      )}
      <div style={{ marginTop: "20px" }} />
      {pageState.reportToShow === "report2" && (
        <ReportViz2 user={pageState.userComboValue} jwt={pageState.jwt} />
      )}
      <div style={{ marginTop: "20px" }} />
    </div>
  );
}

export default App;
