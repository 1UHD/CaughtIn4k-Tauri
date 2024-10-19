import Account from "./Account";
import APIStatus from "./APIStatus";
import Session from "./Session";
import Settings from "./Settings";

function Sidebar() {
    return (
        <div className="sidebar">
            <APIStatus />
            <Session />
            <Settings />
            <Account />
        </div>
    );
}

export default Sidebar;
