export function Home() {
  return (
    <div>
      <h2 className="text-center text-3xl">Welcome to the Tableau Embed POC</h2>
      <div className="w-full px-4">
        <p>Select a report to view in the menu</p>
        <p>Switch users in the menu, each user has their own report filters</p>
        <p>
          The Report using vizFilter stores the user filter locally in session
          storage
        </p>
        <p>
          The Report using custom view stores its filters on the Tableau server
          that hosts the report
        </p>
      </div>
    </div>
  );
}
