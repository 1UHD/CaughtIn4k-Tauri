import AppManagement from "./AppManagement";
import Logo from "./Logo";
import PlayerSearch from "./PlayerSearch";

function Titlebar() {
    return (
        <div data-tauri-drag-region className="titlebar">
            <Logo />
            <PlayerSearch />
            <AppManagement />
        </div>
    );
}

export default Titlebar;
