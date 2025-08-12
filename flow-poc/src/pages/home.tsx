import { useAppContext } from "@/app/AppContext";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function Home() {
  const { jwt } = useAppContext();

  return (
    <div>
      <div>
        <h2 className="text-center text-3xl">
          Welcome to the Tableau Embed POC
        </h2>
        <ul className="w-full px-4">
          <li>Select a report to view in the menu</li>
          <li>
            Switch users in the menu, each user has their own report filters
          </li>
          <li>
            The Report using vizFilter stores the user filter locally in session
            storage
          </li>
          <li>
            The Report using custom view stores its filters on the Tableau
            server that hosts the report
          </li>
        </ul>
      </div>
      {jwt && (
        <Accordion type="single" collapsible className="w-80 md:w-6xl px-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>Show current JWT ticket</AccordionTrigger>
            <AccordionContent className="break-all pl-0">
              {jwt}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
