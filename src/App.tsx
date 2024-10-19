import { useEffect } from "react";
import "./App.css";
import Menus from "./components/Menus";
import Sidebar from "./components/Sidebar";
import StatsTable from "./components/StatsTable";
import Titlebar from "./components/Titlebar";

function App() {
    useEffect(() => {
        //execute on launch
        return () => {};
    }, []);

    return (
        <div className="container">
            <Titlebar />
            <StatsTable />
            <Sidebar />
            <Menus />
        </div>
    );
}

export default App;
