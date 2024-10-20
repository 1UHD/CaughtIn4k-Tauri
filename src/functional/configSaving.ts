import * as path from "@tauri-apps/api/path";
import {
    exists,
    mkdir,
    readDir,
    readTextFile,
    writeTextFile,
} from "@tauri-apps/plugin-fs";
import { ThemeProperties } from "../components/AppearanceMenu";
import { app } from "@tauri-apps/api";
import { open } from "@tauri-apps/plugin-shell";

const homedir = await path.homeDir();
const appPath = await path.join(homedir, "/.caughtin4k");
const configPath = await path.join(homedir, "/.caughtin4k/config");
const fontsPath = await path.join(homedir, "/.caughtin4k/fonts");
const themesPath = await path.join(homedir, "/.caughtin4k/themes");

export async function createConfigFile() {
    const dotfileExists = await exists(appPath);
    const configPathExists = await exists(configPath);
    const fontsPathExists = await exists(fontsPath);
    const themesPathExists = await exists(themesPath);

    if (!dotfileExists) {
        await mkdir(appPath);
    } else console.log("1");

    if (!configPathExists) {
        await mkdir(configPath);
    } else console.log("2");

    if (!fontsPathExists) {
        await mkdir(fontsPath);
    } else console.log("3");

    if (!themesPathExists) {
        await mkdir(themesPath);
    } else console.log("4");
}

export async function createTheme(theme: any) {
    const name = theme.name.replace(" ", "_");
    const themeJSON = JSON.stringify(theme);
    await writeTextFile(`${themesPath}/${name}.json`, themeJSON);
}

export async function getTheme(themeName: any, setTheme: any) {
    const themeText = await readTextFile(
        await path.join(themesPath, themeName)
    );
    let themeJSON: ThemeProperties = JSON.parse(themeText);
    themeJSON.setTheme = setTheme;

    return themeJSON;
}

export async function openThemeFolder() {
    await open(themesPath);
}

export async function getAllThemes(setTheme: any) {
    const themesDir = await readDir(themesPath);
    let themes: ThemeProperties[] = [];

    for (const theme of themesDir) {
        if (!theme.name.includes(".json") || theme.name === "tc.json") continue;

        const themeJSON = await getTheme(theme.name, setTheme);
        themes.push(themeJSON);
    }

    return themes;
}

export async function getCurrentTheme() {
    try {
        const stringifiedJSON = await readTextFile(
            await path.join(themesPath, "tc.json")
        );
        const json = JSON.parse(stringifiedJSON);
        const selected = json.selectedTheme;
        const transparency = json.currentTransparency;
        return [selected, transparency];
    } catch (e) {
        return ["Default", 100];
    }
}

export async function setCurrentTheme(currentTheme: string) {
    const stringifiedJSON1 = await readTextFile(
        //what the actual fuck is this god awful naming scheme???
        await path.join(themesPath, "tc.json")
    );

    const json1 = JSON.parse(stringifiedJSON1);

    let json = {
        selectedTheme: currentTheme,
        currentTransparency: json1.currentTransparency,
    };
    const stringifiedJSON = JSON.stringify(json);
    await writeTextFile(
        await path.join(themesPath, "tc.json"),
        stringifiedJSON
    );
}

export async function setCurrentTransparency(currentTransparency: string) {
    const stringifiedJSON1 = await readTextFile(
        //what the actual fuck is this god awful naming scheme???
        // ^ this comment exists twice because I copied the code
        await path.join(themesPath, "tc.json")
    );

    const json1 = JSON.parse(stringifiedJSON1);

    let json = {
        selectedTheme: json1.selectedTheme,
        currentTransparency: currentTransparency,
    };
    const stringifiedJSON = JSON.stringify(json);
    await writeTextFile(
        await path.join(themesPath, "tc.json"),
        stringifiedJSON
    );
}
