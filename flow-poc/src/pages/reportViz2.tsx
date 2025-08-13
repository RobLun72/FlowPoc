import {
  Api,
  TableauViz,
  //useTableauVizFilterChangedCallback,
  useTableauVizRef,
} from "@tableau/embedding-api-react";
import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/lib/useResponsive";

export interface DepartmentFilter {
  fieldName: string;
  appliedValues: Array<string>;
}

export interface ReportViz2Props {
  user?: string;
  jwt?: string;
}

export function ReportViz2({ user }: ReportViz2Props) {
  const page = useLocation();
  const qParams = new URLSearchParams(page.search);

  if (qParams.has("user")) {
    user = qParams.get("user") || user;
  }

  const { isMobile } = useResponsive();

  const vizRef = useTableauVizRef();

  const getActiveWorkbook = useCallback(<T extends Api.Workbook>(): T => {
    const viz = vizRef.current;
    if (!viz) {
      throw new Error("TableauViz ref not assigned yet.");
    }

    return viz.workbook as T;
  }, [vizRef]);

  const onSaveCustomView = async () => {
    const viz = vizRef.current;
    if (!viz) {
      throw new Error("TableauViz ref not assigned yet.");
    }
    try {
      // Save the current view as a custom view
      const workbook = getActiveWorkbook();
      await workbook.saveCustomViewAsync("ThisReportFor-" + user);
      console.log("Custom view saved successfully.");
    } catch (error) {
      console.error("Failed to save custom view:", error);
    }
  };

  const onGetCustomView = useCallback(
    async (user: string) => {
      const viz = vizRef.current;
      if (!viz) {
        throw new Error("TableauViz ref not assigned yet.");
      }
      try {
        // Save the current view as a custom view
        const workbook = getActiveWorkbook();
        if (user === "") {
          await workbook.showCustomViewAsync("");
          console.log("Default view shown successfully.");
        } else {
          await workbook.showCustomViewAsync("ThisReportFor-" + user);
          console.log("Custom view shown successfully.");
        }
      } catch (error) {
        console.error("Failed to show custom view:", error);
      }
    },
    [getActiveWorkbook, vizRef]
  );

  useEffect(() => {
    onGetCustomView(user!);
  }, [onGetCustomView, user]);

  const onExportPDF = async () => {
    const viz = vizRef.current;
    if (!viz) {
      throw new Error("TableauViz ref not assigned yet.");
    }

    try {
      // Export the entire workbook/dashboard to PDF
      await viz.displayDialogAsync(Api.TableauDialogType.ExportPDF);
    } catch (error) {
      console.error("Failed to export PDF:", error);
    }
  };

  const onExportExcel = async () => {
    const viz = vizRef.current;
    if (!viz) {
      throw new Error("TableauViz ref not assigned yet.");
    }

    try {
      // Export to Excel using crosstab format
      await viz.displayDialogAsync(Api.TableauDialogType.ExportCrossTab);
    } catch (error) {
      console.error("Failed to export to Excel:", error);
    }
  };

  return (
    <div>
      <div
        className={cn(
          "flex gap-2.5 mb-5 min-w-sm w-fit md:min-w-3xl md:max-w-7xl",
          isMobile && "flex-col"
        )}
      >
        <Button
          onClick={onExportPDF}
          className="ml-4 bg-app-primary hover:bg-app-primary-hover text-white"
        >
          Export PDF
        </Button>
        <Button
          onClick={onExportExcel}
          className="ml-4 bg-app-primary hover:bg-app-primary-hover text-white"
        >
          Export Excel
        </Button>
        <Button
          onClick={onSaveCustomView}
          className="ml-4 bg-app-primary hover:bg-app-primary-hover text-white"
        >
          save filter
        </Button>
        <Button
          onClick={() => onGetCustomView(user!)}
          className="ml-4 bg-app-primary hover:bg-app-primary-hover text-white"
        >
          apply filter
        </Button>
        <Button
          onClick={() => onGetCustomView("")}
          className="ml-4 bg-app-primary hover:bg-app-primary-hover text-white"
        >
          apply default filter
        </Button>
      </div>
      <TableauViz
        ref={vizRef}
        width={isMobile ? "420px" : "1200px"}
        device={isMobile ? "phone" : "desktop"}
        height="900px"
        src="https://public.tableau.com/views/OverbudgetTravel/Dashboard1"
        toolbar="hidden" // Hide entire toolbar
        hideTabs
        // The version check is disabled so these samples can run against Tableau Public even when
        // the version of Tableau is incompatible with this version of the Embedding API.
        // It is recommended to remove the 'disableVersionCheck' prop in your own web applications.
        disableVersionCheck
      />
    </div>
  );
}
