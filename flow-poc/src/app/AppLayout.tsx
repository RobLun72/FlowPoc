import { useEffect, useState } from "react";
import "./App.css";
import { useAppContext } from "./AppContext";
import { AppMenu } from "./AppMenu";
import { AppRoutes } from "./AppRoutes";

interface AppLayoutState {
  load: boolean;
  reportName: string;
}

interface jwtResponse {
  message: string;
  jwtToken: string;
}

export function AppLayout() {
  const [pageState, setPageState] = useState<AppLayoutState>({
    load: true,
    reportName: "report1",
  });

  const { user, setUser, setJwt } = useAppContext();

  useEffect(() => {
    async function getData(api: string) {
      const data = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          report: pageState.reportName,
          user: user === undefined || user === "" ? "adam" : user,
        }),
      });
      const result: jwtResponse = await data.json();
      setPageState({
        ...pageState,
        load: false,
      });
      setJwt(result.jwtToken);
      if (user === undefined || user === "") {
        setUser("adam");
      }
    }

    if (pageState.load) {
      getData("http://localhost:5174/api/tableau/jwt");
    }
  }, [pageState.load, pageState, setJwt, setUser, user]);

  return (
    <div>
      <div className="bg-app-primary h-1.5"></div>
      <div className="bg-white mb-1 w-full ">
        <div className="float-left w-full">
          <img src="/Solita.jpg" alt="Logo" className="logo" />
        </div>
      </div>
      <AppMenu />
      <div className="m-4" />
      <AppRoutes />
    </div>
  );
}
