import {
  Api,
  TableauViz,
  useTableauVizFilterChangedCallback,
  useTableauVizRef,
} from "@tableau/embedding-api-react";
import { useLocation } from "react-router-dom";

export interface DepartmentFilter {
  fieldName: string;
  appliedValues: Array<string>;
}

export interface ReportVizProps {
  user?: string;
}

export function ReportViz({ user }: ReportVizProps) {
  const page = useLocation();
  const qParams = new URLSearchParams(page.search);

  if (qParams.has("user")) {
    user = qParams.get("user") || user;
  }

  const vizRef = useTableauVizRef();
  const field = "Department";

  const getCurStorageKey = () => {
    if (!user) {
      return "deptFilter-adam";
    } else {
      return "deptFilter-" + user;
    }
  };

  const getCurDeptFilter = () => {
    const localStorageKey = getCurStorageKey();
    const curDeptFilter = localStorage.getItem(localStorageKey);

    let filter: DepartmentFilter = {
      fieldName: field,
      appliedValues: [],
    };
    if (curDeptFilter !== null) {
      filter = JSON.parse(curDeptFilter) as DepartmentFilter;
    }

    return filter;
  };

  const parseDepartmentFilter = async (department?: string) => {
    console.log("Parsing department filter:", department);

    if (department !== undefined) {
      const options: Api.FilterOptions = { isExcludeMode: false };

      await getActiveSheet().applyFilterAsync(
        field,
        [department],
        Api.FilterUpdateType.Replace,
        options
      );
      const filter: DepartmentFilter = {
        fieldName: field,
        appliedValues: department ? [department] : [],
      };
      localStorage.setItem(getCurStorageKey(), JSON.stringify(filter));
    } else {
      const filter: DepartmentFilter = {
        fieldName: field,
        appliedValues: [],
      };
      localStorage.setItem(getCurStorageKey(), JSON.stringify(filter));
      await clearFilter();
    }
  };

  const clearFilter = async () => {
    const sheet = getActiveSheet();

    if (sheet.sheetType === "worksheet") {
      await (sheet as Api.Worksheet).clearFilterAsync(field);
    } else if (sheet.sheetType === "dashboard") {
      // For dashboards, you need to clear filters on specific worksheets
      const dashboard = sheet as Api.Dashboard;
      const worksheets = dashboard.worksheets;
      for (const worksheet of worksheets) {
        try {
          await worksheet.clearFilterAsync(field);
        } catch {
          // Handle if the field doesn't exist on this worksheet
          console.warn(
            `Field ${field} not found on worksheet ${worksheet.name}`
          );
        }
      }
    }
  };

  const getActiveSheet = <T extends Api.Worksheet | Api.Dashboard>(): T => {
    const viz = vizRef.current;
    if (!viz) {
      throw new Error("TableauViz ref not assigned yet.");
    }

    return viz.workbook.activeSheet as T;
  };

  const onFilterChanged = useTableauVizFilterChangedCallback(async () => {
    // This function is called when a filter is changed in the Tableau viz.
    // We will check if the Department filter is applied and store it in localStorage.
    const sheetFilters = await getActiveSheet().getFiltersAsync();
    const departmentFilter = sheetFilters.find(
      (f: { fieldName: string }) => f.fieldName === field
    );
    if (departmentFilter) {
      const department = (
        departmentFilter as Api.CategoricalFilter
      ).appliedValues.map((v: { value: unknown }) => v.value);

      const filter: DepartmentFilter = {
        fieldName: field,
        appliedValues: department,
      };
      localStorage.setItem(getCurStorageKey(), JSON.stringify(filter));
    } else {
      localStorage.setItem(getCurStorageKey(), "");
    }
  }, []);

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

  const getVizFilter = () => {
    const filter: DepartmentFilter = getCurDeptFilter();

    return [
      {
        field: filter.fieldName,
        value:
          filter.appliedValues.length > 0 ? filter.appliedValues.join(",") : "",
      },
    ];
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <span style={{ fontWeight: "bold", paddingTop: "13px" }}>
          Department:
        </span>
        <select
          style={{ marginTop: "12px", marginBottom: "9px" }}
          defaultValue=""
          onChange={(event) => {
            console.log("Department changed:", event.target.value);
            parseDepartmentFilter(
              event.target.value !== "all" ? event.target.value : undefined
            );
          }}
        >
          <option value="all">All</option>
          <option value="65455">65455</option>
          <option value="65456">65456</option>
        </select>
        <button
          onClick={onExportPDF}
          className="ml-4 bg-green-700 text-white px-4 py-2 rounded"
        >
          Export PDF
        </button>
        <button
          onClick={onExportExcel}
          className="ml-4 bg-green-700 text-white px-4 py-2 rounded"
        >
          Export Excel
        </button>
      </div>
      <TableauViz
        ref={vizRef}
        width="1000px"
        height="900px"
        src="https://public.tableau.com/views/OverbudgetTravel/Dashboard1"
        toolbar="hidden" // Hide entire toolbar
        hideTabs
        vizFilters={getVizFilter()}
        onFilterChanged={onFilterChanged}
        // The version check is disabled so these samples can run against Tableau Public even when
        // the version of Tableau is incompatible with this version of the Embedding API.
        // It is recommended to remove the 'disableVersionCheck' prop in your own web applications.
        disableVersionCheck
      />
    </div>
  );
}
