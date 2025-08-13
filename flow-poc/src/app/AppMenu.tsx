import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "./AppContext";

interface MenuComponentProps {
  topMenu: string;
  paths: string[];
  items: { title: string; path: string; href: string; description: string }[];
}

const components: MenuComponentProps[] = [
  {
    topMenu: "Reports",
    paths: ["", "report1", "report2"],
    items: [
      {
        title: "Start",
        href: "/",
        path: "",
        description: "Presentation of the reports",
      },
      {
        title: "Report using vizFilter",
        href: "/report1",
        path: "report1",
        description: "Client filtering",
      },
      {
        title: "Report using custom view",
        href: "/report2",
        path: "report2",
        description: "Server filtering",
      },
    ],
  },
];

export function AppMenu() {
  const { user, setUser } = useAppContext();

  const location = useLocation();
  const pathParts = location.pathname.split("/");

  const parseUserFilter = async (user?: string) => {
    if (user !== undefined) {
      setUser(user);
    }
  };

  return (
    <div className="flex min-w-sm max-w-md md:min-w-3xl md:max-w-7xl items-center justify-between bg-neutral-100 px-4 py-2">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold text-app-primary mr-4">
          Tableau embed
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            {components.map((component) => (
              <NavigationMenuItem key={"menu-" + component.topMenu}>
                <NavigationMenuTrigger
                  className={cn(
                    "",
                    component.paths.includes(pathParts[1]) && "underline"
                  )}
                >
                  {component.topMenu}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-appWhite">
                  <ul className="grid w-[200px] gap-3 p-4  grid-cols-1">
                    {component.items.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                        className={cn(
                          "",
                          pathParts[1] === item.path &&
                            "bg-app-primary text-white"
                        )}
                      >
                        <ListItemDescription
                          className={cn(
                            "",
                            pathParts[1] !== item.path && "text-gray-400"
                          )}
                        >
                          {item.description}
                        </ListItemDescription>
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="float-right mr-5">
        <div className="flex gap-2">
          <span className="font-bold pt-2">User:</span>
          <select
            className="p-2"
            defaultValue=""
            onChange={(event) => {
              parseUserFilter(event.target.value);
            }}
          >
            <option value="adam" defaultChecked={user === "adam"}>
              Adam
            </option>
            <option value="eva" defaultChecked={user === "eva"}>
              Eva
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}

const ListItem = ({
  className,
  title,
  href,
  children,
}: {
  className: string;
  title: string;
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <li>
      <Link
        to={href}
        className={cn(
          "group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        {/* <p className="line-clamp-2 text-xs leading-snug text-gray-200 group-hover:text-accent-foreground"> */}
        {children}
        {/* </p> */}
      </Link>
    </li>
  );
};

const ListItemDescription = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "line-clamp-2 text-xs leading-snug text-gray-200 group-hover:text-accent-foreground",
        className
      )}
    >
      {children}
    </p>
  );
};
