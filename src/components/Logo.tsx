import { closeOthers } from "./Settings";

let sidebarToggled = false;

function Logo() {
    const open_sidebar = () => {
        const sidebar = document.querySelector<HTMLElement>(".sidebar");
        const account = document.querySelector<HTMLElement>(".sidebar-account");

        if (!sidebar || !account) {
            return;
        }

        if (sidebarToggled) {
            closeOthers("None");
            sidebar.style.left = "-250px";
            account.style.left = "-250px";
            sidebarToggled = false;
        } else {
            sidebar.style.left = "0";
            account.style.left = "0";
            sidebarToggled = true;
        }
    };

    return (
        <div className="titlebar-logo">
            <img
                src="./logo.png"
                onClick={open_sidebar}
                id="titlebar-logo-logo"></img>
            <img src="./title.png" id="titlebar-logo-title"></img>
        </div>
    );
}

export default Logo;
