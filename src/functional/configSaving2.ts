import * as path from "@tauri-apps/api/path";
import {
    exists,
    readDir,
    readTextFile,
    writeTextFile,
} from "@tauri-apps/plugin-fs";
import { ThemeProperties } from "../components/AppearanceMenu";

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
}

export async function testFunc(setTheme: any) {
    getAllThemes(setTheme);
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

export async function getAllThemes(setTheme: any) {
    const themesDir = await readDir(themesPath);
    let themes: ThemeProperties[] = [];

    for (const theme of themesDir) {
        if (!theme.name.includes(".json")) continue;

        const themeJSON = await getTheme(theme.name, setTheme);
        themes.push(themeJSON);
    }

    return themes;
}
