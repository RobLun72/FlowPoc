import type { FunctionComponent } from "react";
import { Home } from "./components/home";
import { ReportViz } from "./components/reportViz";
import { ReportViz2 } from "./components/reportViz2";
import { Route, Routes } from "react-router-dom";
import { useAppContext } from "./AppContext";

export const AppRoutes: FunctionComponent = () => {
  const { user } = useAppContext();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/report1" element={<ReportViz user={user} />} />
      <Route path="/report2" element={<ReportViz2 user={user} />} />
    </Routes>
  );
};
