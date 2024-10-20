let settingsVisibility = true;

export const closeOthers = (menu: string) => {
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].name === menu) {
            continue;
        } else {
            if (buttons[i].toggled) {
                buttons[i].onClick();
            }
        }
    }
};

const toggleVisibility = () => {
    const settings = document.querySelector<HTMLElement>(
        ".sidebar-settings-buttons"
    );

    if (!settings) {
        return;
    }

    if (settingsVisibility) {
        settings.style.visibility = "hidden";
        settings.style.position = "absolute";
        settingsVisibility = false;
    } else {
        settings.style.visibility = "visible";
        settings.style.position = "relative";
        settingsVisibility = true;
    }
};

const onClickAppearance = () => {
    const appearanceMenu =
        document.querySelector<HTMLElement>(".menus-appearance");

    if (!appearanceMenu) {
        return;
    }

    if (buttons[0].toggled) {
        appearanceMenu.style.right = "calc(-100vw + 200px)";
        buttons[0].toggled = false;
    } else {
        closeOthers("Appearance");
        appearanceMenu.style.right = "0";
        buttons[0].toggled = true;
    }
};
const onClickKeyboard = () => {
    const keyboardMenu = document.querySelector<HTMLElement>(".menu-keyboard");

    if (!keyboardMenu) {
        return;
    }

    if (buttons[1].toggled) {
        keyboardMenu.style.right = "calc(-100vw + 200px)";
        buttons[1].toggled = false;
    } else {
        closeOthers("Keyboard");
        keyboardMenu.style.right = "0";
        buttons[1].toggled = true;
    }
};

const onClickGeneral = () => {};

let buttons = [
    {
        name: "Appearance",
        logo: "./appearance_logo.png",
        onClick: onClickAppearance,
        toggled: false,
    },
    {
        name: "Keyboard",
        logo: "./keyboard_logo.png",
        onClick: onClickKeyboard,
        toggled: false,
    },
    {
        name: "General",
        logo: "./general_settings_logo.png",
        onClick: onClickGeneral,
        toggled: false,
    },
];

function Settings() {
    return (
        <div className="sidebar-settings">
            <h1 onClick={toggleVisibility}>SETTINGS</h1>
            <div className="sidebar-settings-buttons">
                {buttons.map((item) => (
                    <p onClick={item.onClick} id={"button-" + item.name}>
                        <img src={item.logo}></img> {item.name}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default Settings;
