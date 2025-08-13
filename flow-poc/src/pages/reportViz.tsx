import {
  Api,
  TableauViz,
  useTableauVizFilterChangedCallback,
  useTableauVizRef,
} from "@tableau/embedding-api-react";
import { useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useResponsive } from "@/lib/useResponsive";
import { cn } from "@/lib/utils";

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

  const { isMobile } = useResponsive();

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
          console.error(
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
      <div
        className={cn(
          "flex gap-2.5 mb-5 min-w-sm w-fit md:min-w-3xl md:max-w-7xl",
          isMobile && "flex-col"
        )}
      >
        <div>
          <span className="pl-4 pt-1 font-bold">Department:</span>
          <select
            className="ml-2 mt-1 mb-2"
            defaultValue=""
            onChange={(event) => {
              parseDepartmentFilter(
                event.target.value !== "all" ? event.target.value : undefined
              );
            }}
          >
            <option value="all">All</option>
            <option value="65455">65455</option>
            <option value="65456">65456</option>
          </select>
        </div>
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
      </div>
      <TableauViz
        ref={vizRef}
        width={isMobile ? "420px" : "1200px"}
        height="900px"
        device={isMobile ? "phone" : "desktop"}
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
