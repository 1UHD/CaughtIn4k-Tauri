import { KeyboardEvent, useState } from "react";

function KeyboardShortcut({ name }: any) {
    const [keybind, setKeybind] = useState("");
    const [modKeys, setModKeys] = useState<string[]>([]);

    const comboKeys = ["CONTROL", "ALT", "SHIFT", "META"];

    const handleKeyDown = (event: KeyboardEvent) => {
        let key = event.key.toUpperCase();

        if (comboKeys.includes(key)) {
            if (!modKeys.includes(key)) {
                setKeybind([...modKeys, key].join("+").replace("META", "CTRL"));
                setModKeys((prevKeys) => [...prevKeys, key]);
            }
        } else {
            let newKeybind = [...modKeys, key]
                .join("+")
                .replace("META", "CTRL");

            setKeybind(newKeybind);
            setModKeys([]);
            if (event.target instanceof HTMLElement) event.target.blur();
        }
    };

    const handleBlur = () => {
        //clear keybind & modkeys and setKeybind to last logged keybind
    };

    return (
        <div className="menu-keyboard-shortcut">
            <p>{name}</p>
            <input
                type="text"
                value={keybind}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                readOnly></input>
        </div>
    );
}

function KeyBoardMenu() {
    const statsKeyboardShortcuts = [
        "Clear Players",
        "Add Player",
        "Remove Player",
    ];

    const windowKeyboardShortcuts = ["Hide Window", "Minimize Window", "Quit"];

    return (
        <div className="menu-keyboard">
            <div className="menu-keyboard-stats">
                <h1 id="menu-keyboard-header">STATS</h1>
                {statsKeyboardShortcuts.map((shortcut) => (
                    <KeyboardShortcut name={shortcut} />
                ))}
            </div>
            <div className="menu-keyboard-window">
                <h1 id="menu-keyboard-header">WINDOW</h1>
                {windowKeyboardShortcuts.map((shortcut) => (
                    <KeyboardShortcut name={shortcut} />
                ))}
            </div>
        </div>
    );
}

export default KeyBoardMenu;
