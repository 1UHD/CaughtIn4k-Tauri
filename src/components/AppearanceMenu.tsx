import { useEffect, useState } from "react";
import {
    createTheme,
    getAllThemes,
    getCurrentTheme,
    getTheme,
    setCurrentTheme,
} from "../functional/configSaving2";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { setTheme } from "@tauri-apps/api/app";

//TODO: add system fonts & fonts folder (so basically everything :/)
//TODO: add config save for colors

const hexToRgb = (
    hex: string,
    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
) => {
    return result ? result.map((i) => parseInt(i, 16)).slice(1) : null;
};

const getVal = (value: string) => {
    return getComputedStyle(document.body).getPropertyValue(value);
};

const setVal = (value: string, newValue: string) => {
    document.documentElement.style.setProperty(value, newValue);
};

function StatsAppearance() {
    const [tableStripes, setTableStripes] = useState(true);

    const toggleTableStripes = () => {
        if (tableStripes) {
            setTableStripes(false);
            document.documentElement.style.setProperty(
                "--table-stripes-color",
                "var(--body-color)"
            );
        } else {
            setTableStripes(true);
            document.documentElement.style.setProperty(
                "--table-stripes-color",
                "var(--saved-table-stripes-color)"
            );
        }
        //looking at the outputs, the values are correct, I have no fucking idea why its being displayed wrong
    };

    return (
        <div className="menu-appearance-stats">
            <h1 id="menu-appearance-stats-header">STATS</h1>
            <div className="menu-appearance-stats-stripes">
                <p>Stats table stripes</p>
                <div className="menu-appearance-stats-stripes-toggle">
                    {tableStripes ? (
                        <img
                            src="./on inactive.png"
                            onClick={toggleTableStripes}></img>
                    ) : (
                        <img
                            src="./off inactive.png"
                            onClick={toggleTableStripes}></img>
                    )}
                </div>
            </div>
        </div>
    );
}

function FontsAppearance() {
    useEffect(() => {
        const unlistenResetTheme = listen<string>("reset-theme", () => {
            resetHeaderColor();
            resetTextColor();
        });

        return () => {
            unlistenResetTheme.then((unlisten) => unlisten());
        };
    }, []);

    let fontsVisibility = false;

    const [activeFont, setActiveFont] = useState("Minecraft");
    const [installedFonts, setInstalledFonts] = useState<string[]>([
        "Minecraft",
    ]);
    const [textColor, setTextColor] = useState<string>(
        getComputedStyle(document.body).getPropertyValue("--text-color")
    );
    const [headerColor, setHeaderColor] = useState<string>(
        getComputedStyle(document.body).getPropertyValue("--header-color")
    );
    const [textColorChanged, setTextColorChanged] = useState(false);
    const [headerColorChanged, setHeaderColorChanged] = useState(false);

    const selectDifferentFont = () => {
        const fontpicker = document.querySelector<HTMLElement>(
            ".menu-appearance-fonts-ifonts"
        );

        if (!fontpicker) {
            return;
        }

        if (fontsVisibility) {
            fontpicker.style.visibility = "hidden";
            fontpicker.style.position = "absolute";
            fontsVisibility = false;
        } else {
            fontpicker.style.visibility = "visible";
            fontpicker.style.position = "relative";
            fontsVisibility = true;
        }
    };

    const onFontPick = (event: any) => {
        setActiveFont(event.target.innerHTML);
    };

    //TEXT
    const onTextColorChange = (event: any) => {
        setTextColorChanged(true);
        setTextColor(event.target.value);
        document.documentElement.style.setProperty(
            "--text-color",
            event.target.value
        );
    };

    const resetTextColor = () => {
        document.documentElement.style.setProperty(
            "--text-color",
            "var(--default-text-color)"
        );
        setTextColor(
            getComputedStyle(document.body).getPropertyValue(
                "--default-text-color"
            )
        );
        setTextColorChanged(false);
    };

    const onHeaderColorChange = (event: any) => {
        setHeaderColorChanged(true);
        setHeaderColor(event.target.value);
        document.documentElement.style.setProperty(
            "--header-color",
            event.target.value
        );
    };

    const resetHeaderColor = () => {
        document.documentElement.style.setProperty(
            "--header-color",
            "var(--default-header-color)"
        );
        setHeaderColor(
            getComputedStyle(document.body).getPropertyValue(
                "--default-header-color"
            )
        );
        setHeaderColorChanged(false);
    };

    return (
        <div className="menu-appearance-fonts">
            <h1 id="menu-appearance-fonts-header">FONTS</h1>
            <p id="menu-appearance-fonts-activefont">
                Active font: {activeFont}
            </p>
            <p
                id="menu-appearance-fonts-selectfont"
                onClick={selectDifferentFont}>
                Select different font
            </p>
            <div className="menu-appearance-fonts-ifonts">
                {installedFonts.map((font) => (
                    <p onClick={onFontPick}>{font}</p>
                ))}
            </div>
            <p id="menu-appearance-fonts-fontsfolder">Fonts Folder</p>
            <div className="menu-appearance-fonts-colors">
                <div className="menu-appearance-fonts-colors-text">
                    {textColorChanged ? (
                        <p
                            onClick={resetTextColor}
                            id="menu-appearance-fonts-colors-text-reset">
                            Text Color (Reset)
                        </p>
                    ) : (
                        <p>Text Color</p>
                    )}
                    <input
                        type="color"
                        onChange={onTextColorChange}
                        value={textColor}></input>
                </div>
                <div className="menu-appearance-fonts-colors-header">
                    {headerColorChanged ? (
                        <p
                            onClick={resetHeaderColor}
                            id="menu-appearance-fonts-colors-header-reset">
                            Header Color (Reset)
                        </p>
                    ) : (
                        <p>Header Color</p>
                    )}
                    <input
                        type="color"
                        onChange={onHeaderColorChange}
                        value={headerColor}></input>
                </div>
            </div>
        </div>
    );
}

function InterfaceAppearance() {
    useEffect(() => {
        const unlistenResetTheme = listen<string>("reset-theme", () => {
            resetBody();
            resetMenu();
            resetSelect();
            resetStripes();
            resetTitlebar();
            setTransparencyValue(100);
        });

        return () => {
            unlistenResetTheme.then((unlisten) => unlisten());
        };
    }, []);

    const [transparencyValue, setTransparencyValue] = useState(100);

    const [bodyColor, setBodyColor] = useState(
        getComputedStyle(document.body).getPropertyValue(
            "--no-alpha-body-color"
        )
    );
    const [stripesColor, setStripesColor] = useState(
        getComputedStyle(document.body).getPropertyValue(
            "--no-alpha-table-stripes-color"
        )
    );
    const [titlebarColor, setTitlebarColor] = useState(
        getComputedStyle(document.body).getPropertyValue("--titlebar-color")
    );
    const [menuColor, setMenuColor] = useState(
        getComputedStyle(document.body).getPropertyValue("--menu-color")
    );
    const [selectColor, setSelectColor] = useState(
        getComputedStyle(document.body).getPropertyValue("--select-color")
    );

    const [bodyColorChanged, setBodyColorChanged] = useState(false);
    const [stripesColorChanged, setStripesColorChanged] = useState(false);
    const [titlebarColorChanged, setTitlebarColorChanged] = useState(false);
    const [menuColorChanged, setMenuColorChanged] = useState(false);
    const [selectColorChanged, setSelectColorChanged] = useState(false);

    //INTERFACE
    const onTransparencyChange = (event: any) => {
        let bodyColors = hexToRgb(
            getComputedStyle(document.body).getPropertyValue(
                "--no-alpha-body-color"
            )
        );
        let tableStripesColors = hexToRgb(
            getComputedStyle(document.body).getPropertyValue(
                "--no-alpha-table-stripes-color"
            )
        );

        if (!bodyColors || !tableStripesColors) {
            return;
        }

        document.documentElement.style.setProperty(
            "--body-color",
            `rgba(${bodyColors[0]}, ${bodyColors[1]}, ${bodyColors[2]}, ${
                event.target.value / 100
            })`
        );
        document.documentElement.style.setProperty(
            "--table-stripes-color",
            `rgba(${tableStripesColors[0]}, ${tableStripesColors[1]}, ${
                tableStripesColors[2]
            }, ${event.target.value / 100})`
        );

        document.documentElement.style.setProperty(
            "--saved-table-stripes-color",
            `rgba(${tableStripesColors[0]}, ${tableStripesColors[1]}, ${
                tableStripesColors[2]
            }, ${event.target.value / 100})`
        );

        setTransparencyValue(event.target.value);
    };

    const onBodyChange = (event: any) => {
        setBodyColorChanged(true);
        setBodyColor(event.target.value);
        let valueRGB = hexToRgb(event.target.value);

        if (!valueRGB) return;

        document.documentElement.style.setProperty(
            "--body-color",
            `rgba(${valueRGB[0]}, ${valueRGB[1]}, ${valueRGB[2]}, ${
                transparencyValue / 100
            })`
        );
        document.documentElement.style.setProperty(
            "--no-alpha-body-color",
            event.target.value
        );
    };

    const resetBody = () => {
        setBodyColorChanged(false);
        setBodyColor(
            getComputedStyle(document.body).getPropertyValue(
                "--default-no-alpha-body-color"
            )
        );

        document.documentElement.style.setProperty(
            "--body-color",
            "var(--default-body-color)"
        );

        document.documentElement.style.setProperty(
            "--no-alpha-body-color",
            "var(--default-no-alpha-body-color)"
        );
    };

    const onStripesChange = (event: any) => {
        setStripesColorChanged(true);
        setStripesColor(event.target.value);
        let valueRGB = hexToRgb(event.target.value);

        if (!valueRGB) return;

        document.documentElement.style.setProperty(
            "--table-stripes-color",
            `rgba(${valueRGB[0]}, ${valueRGB[1]}, ${valueRGB[2]}, ${
                transparencyValue / 100
            })`
        );
        document.documentElement.style.setProperty(
            "--saved-table-stripes-color",
            `rgba(${valueRGB[0]}, ${valueRGB[1]}, ${valueRGB[2]}, ${
                transparencyValue / 100
            })`
        );
        document.documentElement.style.setProperty(
            "--no-alpha-table-stripes-color",
            event.target.value
        );
        document.documentElement.style.setProperty(
            "--no-alpha-saved-table-stripes-color",
            event.target.value
        );
    };

    const resetStripes = () => {
        setStripesColorChanged(false);
        setStripesColor(
            getComputedStyle(document.body).getPropertyValue(
                "--default-no-alpha-table-stripes-color"
            )
        );

        document.documentElement.style.setProperty(
            "--table-stripes-color",
            "var(--default-table-stripes-color)"
        );

        document.documentElement.style.setProperty(
            "--saved-table-stripes-color",
            "var(--default-table-stripes-color)"
        );

        document.documentElement.style.setProperty(
            "--no-alpha-table-stripes-color",
            "var(--default-no-alpha-table-stripes-color)"
        );

        document.documentElement.style.setProperty(
            "--no-alpha-saved-table-stripes-color",
            "var(--default-no-alpha-table-stripes-color)"
        );
    };

    const onMenuChange = (event: any) => {
        setMenuColorChanged(true);
        setMenuColor(event.target.value);
        let valueRGB = hexToRgb(event.target.value);

        if (!valueRGB) return;

        document.documentElement.style.setProperty(
            "--menu-color",
            `rgba(${valueRGB[0]}, ${valueRGB[1]}, ${valueRGB[2]}, ${
                transparencyValue / 100
            })`
        );
    };

    const resetMenu = () => {
        setMenuColorChanged(false);
        setMenuColor(
            getComputedStyle(document.body).getPropertyValue(
                "--default-menu-color"
            )
        );

        document.documentElement.style.setProperty(
            "--menu-color",
            "var(--default-menu-color)"
        );
    };

    const onTitlebarChange = (event: any) => {
        setTitlebarColorChanged(true);
        setTitlebarColor(event.target.value);
        let valueRGB = hexToRgb(event.target.value);

        if (!valueRGB) return;

        document.documentElement.style.setProperty(
            "--titlebar-color",
            `rgba(${valueRGB[0]}, ${valueRGB[1]}, ${valueRGB[2]}, ${
                transparencyValue / 100
            })`
        );
    };

    const resetTitlebar = () => {
        setTitlebarColorChanged(false);
        setTitlebarColor(
            getComputedStyle(document.body).getPropertyValue(
                "--default-titlebar-color"
            )
        );

        document.documentElement.style.setProperty(
            "--titlebar-color",
            "var(--default-titlebar-color)"
        );
    };

    const onSelectChange = (event: any) => {
        setSelectColorChanged(true);
        setSelectColor(event.target.value);
        let valueRGB = hexToRgb(event.target.value);

        if (!valueRGB) return;

        document.documentElement.style.setProperty(
            "--select-color",
            `rgba(${valueRGB[0]}, ${valueRGB[1]}, ${valueRGB[2]}, ${
                transparencyValue / 100
            })`
        );
    };

    const resetSelect = () => {
        setSelectColorChanged(false);
        setSelectColor(
            getComputedStyle(document.body).getPropertyValue(
                "--default-select-color"
            )
        );

        document.documentElement.style.setProperty(
            "--select-color",
            "var(--default-select-color)"
        );
    };

    const interfaceColors = [
        {
            name: "Background",
            cssName: "body",
            value: bodyColor,
            isChanged: bodyColorChanged,
            onChange: onBodyChange,
            resetChange: resetBody,
        },
        {
            name: "Table Stripes",
            cssName: "stripes",
            value: stripesColor,
            isChanged: stripesColorChanged,
            onChange: onStripesChange,
            resetChange: resetStripes,
        },
        {
            name: "Menu",
            cssName: "menu",
            value: menuColor,
            isChanged: menuColorChanged,
            onChange: onMenuChange,
            resetChange: resetMenu,
        },
        {
            name: "Titlebar",
            cssName: "titlebar",
            value: titlebarColor,
            isChanged: titlebarColorChanged,
            onChange: onTitlebarChange,
            resetChange: resetTitlebar,
        },
        {
            name: "Selected items",
            cssName: "select",
            value: selectColor,
            isChanged: selectColorChanged,
            onChange: onSelectChange,
            resetChange: resetSelect,
        },
    ];

    return (
        <div className="menu-appearance-interface">
            <h1 id="menu-appearance-interface-header">INTERFACE</h1>
            <div className="menu-appearance-interface-transparency">
                <p>Background Transparency</p>
                <input
                    type="range"
                    value={transparencyValue}
                    onChange={onTransparencyChange}></input>
            </div>
            {interfaceColors.map((item) => (
                <div className={"menu-appearance-interface-" + item.cssName}>
                    {item.isChanged ? (
                        <p
                            onClick={item.resetChange}
                            id={
                                "menu-appearance-interface-" +
                                item.cssName +
                                "-reset"
                            }>
                            {item.name} Color (Reset)
                        </p>
                    ) : (
                        <p>{item.name} Color</p>
                    )}
                    <input
                        type="color"
                        onChange={item.onChange}
                        value={item.value}></input>
                </div>
            ))}
        </div>
    );
}

export interface ThemeProperties {
    name: string;
    author: string;
    textColor: string;
    headerColor: string;
    bodyColor: string;
    stripesColor: string;
    menuColor: string;
    titlebarColor: string;
    selectColor: string;
    setTheme: any;
}

const toggleTheme = ({
    name,
    textColor,
    headerColor,
    bodyColor,
    stripesColor,
    menuColor,
    titlebarColor,
    selectColor,
    setTheme,
}: ThemeProperties) => {
    setTheme(name);
    setCurrentTheme(name);

    const bodyRGB = hexToRgb(bodyColor);
    const stripesRGB = hexToRgb(stripesColor);

    if (!bodyRGB || !stripesRGB) return;

    const bodyRGBA = `rgba(${bodyRGB[0]}, ${bodyRGB[1]}, ${bodyRGB[2]}, 100)`;
    const stripesRGBA = `rgba(${stripesRGB[0]}, ${stripesRGB[1]}, ${stripesRGB[2]}, 100)`;

    setVal("--default-no-alpha-body-color", bodyColor);
    setVal("--default-no-alpha-table-stripes-color", stripesColor);
    setVal("--default-no-alpha-saved-table-stripes-color", stripesColor);
    setVal("--default-body-color", bodyRGBA);
    setVal("--default-table-stripes-color", stripesRGBA);
    setVal("--default-menu-color", menuColor);
    setVal("--default-titlebar-color", titlebarColor);
    setVal("--default-saved-table-stripes-color", stripesRGBA);
    setVal("--default-select-color", selectColor);
    setVal("--default-text-color", textColor);
    setVal("--default-header-color", headerColor);

    setVal("--no-alpha-body-color", bodyColor);
    setVal("--no-alpha-table-stripes-color", stripesColor);
    setVal("--no-alpha-saved-table-stripes-color", stripesColor);
    setVal("--body-color", bodyRGBA);
    setVal("--table-stripes-color", stripesRGBA);
    setVal("--menu-color", menuColor);
    setVal("--titlebar-color", titlebarColor);
    setVal("--saved-table-stripes-color", stripesRGBA);
    setVal("--select-color", selectColor);
    setVal("--text-color", textColor);
    setVal("--header-color", headerColor);

    invoke("reset_theme");
};

function Theme({
    name,
    author,
    textColor,
    headerColor,
    bodyColor,
    stripesColor,
    menuColor,
    titlebarColor,
    selectColor,
    setTheme,
}: ThemeProperties) {
    const activateTheme = () => {
        toggleTheme({
            name,
            author,
            textColor,
            headerColor,
            bodyColor,
            stripesColor,
            menuColor,
            titlebarColor,
            selectColor,
            setTheme,
        });
    };

    return (
        <div
            className="menu-appearance-themes-selection-theme"
            onClick={activateTheme}
            key={name}>
            <h1>{name}</h1>
            <p>By: {author}</p>
            <div className="menu-appearance-themes-selection-theme-preview">
                <div
                    className="menu-appearance-themes-selection-theme-preview-titlebar"
                    style={{ backgroundColor: titlebarColor }}></div>
                <div className="menu-appearance-themes-selection-theme-preview-titlebar-body">
                    <div
                        className="menu-appearance-themes-selection-theme-preview-titlebar-body-sidebar"
                        style={{ backgroundColor: menuColor }}></div>
                    <div
                        className="menu-appearance-themes-selection-theme-preview-titlebar-body-table"
                        style={{ backgroundColor: bodyColor }}>
                        <h1 style={{ color: headerColor }}>Header</h1>
                        <p
                            style={{
                                color: textColor,
                                backgroundColor: stripesColor,
                            }}>
                            Text
                        </p>
                        <p style={{ color: selectColor }}>Selected</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ThemeAppearance() {
    const [currentTheme, setCurrentTheme] = useState("Default");
    const [themes, setThemes] = useState<ThemeProperties[]>([]);

    useEffect(() => {
        syncThemes();
        getCurrentTheme().then((rep) => {
            const t = rep.replace(" ", "_");
            getTheme(`${t}.json`, setCurrentTheme).then((resp) => {
                toggleTheme(resp);
            });
        });
    }, []);

    let themeCardVisibility = false;
    const toggleCreateThemeMenu = () => {
        const createmenu = document.querySelector<HTMLElement>(
            ".menu-appearance-themes-createmenu"
        );

        if (!createmenu) return;

        if (themeCardVisibility) {
            createmenu.style.visibility = "hidden";
            createmenu.style.position = "absolute";
            themeCardVisibility = false;
        } else {
            createmenu.style.visibility = "visible";
            createmenu.style.position = "relative";
            themeCardVisibility = true;
        }
    };

    const rgbaToHex = (rgba: string) => {
        const match = rgba.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*\d+\)$/);
        if (!match) {
            throw new Error(`Invalid RGBA string: ${rgba}`);
        }
        const [r, g, b] = match.slice(1).map(Number);
        return `#${r.toString(16).padStart(2, "0")}${g
            .toString(16)
            .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    };

    const saveTheme = () => {
        const themeName = document.getElementById(
            "menu-appearance-themes-createmenu-name"
        ) as HTMLInputElement;

        const themeAuthor = document.getElementById(
            "menu-appearance-themes-createmenu-author"
        ) as HTMLInputElement;

        if (!themeName || !themeAuthor) return;

        if (
            themeName.value === "" ||
            themeAuthor.value === "" ||
            themeName.value.length < 3 ||
            themeAuthor.value.length < 3
        )
            return;

        const name = themeName.value;
        const author = themeAuthor.value;
        const textColor = getVal("--text-color");
        const headerColor = getVal("--header-color");
        const bodyColor = rgbaToHex(getVal("--body-color"));
        const stripesColor = rgbaToHex(getVal("--table-stripes-color"));
        const menuColor = getVal("--menu-color");
        const titlebarColor = getVal("--titlebar-color");
        const selectColor = getVal("--select-color");

        const theme = {
            name: name,
            author: author,
            textColor: textColor,
            headerColor: headerColor,
            bodyColor: bodyColor,
            stripesColor: stripesColor,
            menuColor: menuColor,
            titlebarColor: titlebarColor,
            selectColor: selectColor,
        };

        createTheme(theme);
        syncThemes();
    };

    const syncThemes = async () => {
        const fetched_themes = await getAllThemes(setCurrentTheme);

        setThemes((currentThemes) => {
            return [
                ...currentThemes,
                ...fetched_themes.filter(
                    (theme) => !currentThemes.find((t) => t.name === theme.name)
                ),
            ];
        });
    };

    return (
        <div className="menu-appearance-themes">
            <h1 id="menu-appearance-themes-header">THEMES</h1>
            <p>Current Theme: {currentTheme}</p>
            <p id="menu-appearance-themes-themesfolderbutton">
                Open Themes folder
            </p>
            <p
                onClick={toggleCreateThemeMenu}
                id="menu-appearance-themes-createmenubutton">
                Save current Theme
            </p>
            <div className="menu-appearance-themes-createmenu">
                <input
                    type="text"
                    placeholder="Theme name (required)"
                    maxLength={30}
                    id="menu-appearance-themes-createmenu-name"></input>
                <input
                    type="text"
                    placeholder="Theme author (required)"
                    maxLength={30}
                    id="menu-appearance-themes-createmenu-author"></input>
                <p onClick={saveTheme}>Save Theme</p>
            </div>
            <h1 id="menu-appearance-themes-selectionheader">Selection:</h1>
            <div className="menu-appearance-themes-selection">
                {themes.map((theme) => (
                    <Theme {...theme}></Theme>
                ))}
            </div>
        </div>
    );
}

function AppearanceMenu() {
    return (
        <div className="menus-appearance">
            <StatsAppearance />
            <FontsAppearance />
            <InterfaceAppearance />
            <ThemeAppearance />
        </div>
    );
}

export default AppearanceMenu;
