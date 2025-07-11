import {
  Api,
  TableauViz,
  //useTableauVizFilterChangedCallback,
  useTableauVizRef,
} from "@tableau/embedding-api-react";
import { useCallback, useEffect } from "react";

export interface DepartmentFilter {
  fieldName: string;
  appliedValues: Array<string>;
}

export interface ReportViz2Props {
  user: string;
}

export function ReportViz2({ user }: ReportViz2Props) {
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
    onGetCustomView(user);
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
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={onExportPDF}
          style={{
            marginLeft: "20px",
            background: "#4CAF50",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Export PDF
        </button>
        <button
          onClick={onExportExcel}
          style={{
            marginLeft: "20px",
            background: "#4CAF50",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Export Excel
        </button>
        <button
          onClick={onSaveCustomView}
          style={{
            marginLeft: "20px",
            background: "#4CAF50",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          save filter
        </button>
        <button
          onClick={() => onGetCustomView(user)}
          style={{
            marginLeft: "20px",
            background: "#4CAF50",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          apply filter
        </button>
        <button
          onClick={() => onGetCustomView("")}
          style={{
            marginLeft: "20px",
            background: "#4CAF50",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          apply default filter
        </button>
      </div>
      <TableauViz
        ref={vizRef}
        width="1000px"
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
