import { SetStateAction, useEffect, useState } from "react";
import TopNavigation from "./components/TopNavigation";
import DashboardContent from "./components/DashboardContent";
import ManageContent from "./components/ManageContent";
import SettingsContent from "./components/SettingsContent";
import Popup from "./components/Popup";

import DataContextProvider from "./data/data-context";

function App() {
  const [contentDisplay, setContentDisplay] = useState("dashboard");
  const [isPopup, setIsPopup] = useState(true);

  function handleContentDisplay(selected: SetStateAction<string>) {
    setContentDisplay(selected);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPopup(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  let content = <DashboardContent />;

  if (contentDisplay === "manage") content = <ManageContent />;
  else if (contentDisplay === "settings") content = <SettingsContent />;

  return (
    <main className="flex flex-col m-auto">
      <TopNavigation
        onChangeDisplay={handleContentDisplay}
        selectedTab={contentDisplay}
      />
      {isPopup && (
        <Popup>
          <p>
            Welcome back,{" "}
            <span className="text-red-500 font-bold text-sm md:text-xl">
              Cebu Institute of Technology
            </span>{" "}
            !
          </p>
        </Popup>
      )}
      <DataContextProvider>{content}</DataContextProvider>
    </main>
  );
}

export default App;
