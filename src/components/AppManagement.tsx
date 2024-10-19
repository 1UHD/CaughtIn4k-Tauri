//INFO: uncomment all this code when using TAURI!
//INFO: comment imports and functions when using webview!

import { getCurrentWindow } from "@tauri-apps/api/window";
const appWindow = getCurrentWindow();

function AppManagement() {
    const minimizeWindow = () => {
        try {
            appWindow.minimize();
        } catch (error) {
            console.log("You most likely opened this in web.");
        }
    };

    const closeWindow = () => {
        try {
            appWindow.close();
        } catch (error) {
            console.log("You most likely opened this in web.");
        }
    };

    return (
        <div className="titlebar-appmanagement">
            <div
                className="titlebar-appmanagement-minimize"
                onClick={minimizeWindow}>
                <img
                    src="./minimize inactive.png"
                    id="titlebar-appmanagement-minimize-inactive"></img>
                <img
                    src="./minimize active.png"
                    id="titlebar-management-minimize-active"></img>
                <img
                    src="./minimize pressed.png"
                    id="titlebar-management-minimize-pressed"></img>
            </div>
            <div className="titlebar-appmanagement-close" onClick={closeWindow}>
                <img
                    src="./close inactive.png"
                    id="titlebar-appmanagement-close-inactive"></img>
                <img
                    src="./close active.png"
                    id="titlebar-management-close-active"></img>
                <img
                    src="./close pressed.png"
                    id="titlebar-management-close-pressed"></img>
            </div>
        </div>
    );
}

export default AppManagement;
