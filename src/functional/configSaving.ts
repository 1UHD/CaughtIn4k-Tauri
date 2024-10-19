import os from "os";
import fs from "fs";
import path from "path";
import { ThemeProperties } from "../components/AppearanceMenu";

const userDirectory = os.homedir();
const appFolder = path.join(userDirectory, ".caughtin4k");
const themesFolder = path.join(appFolder, "themes");
const fontsFolder = path.join(appFolder, "fonts");
const configFolder = path.join(appFolder, "config");

export function createConfigFile() {
    if (!fs.existsSync(appFolder)) {
        fs.mkdirSync(appFolder);
    }
    if (!fs.existsSync(themesFolder)) {
        fs.mkdirSync(themesFolder);
    }
    if (!fs.existsSync(fontsFolder)) {
        fs.mkdirSync(fontsFolder);
    }
    if (!fs.existsSync(configFolder)) {
        fs.mkdirSync(configFolder);
    }
}

export function editConfigProperty(
    file: string,
    JSONValue: string,
    value: string
) {
    if (!file) {
        console.log("File not found");
        return;
    }

    const data = fs.readFileSync(file, "utf8");
    let jsonData = JSON.parse(data);
    jsonData[JSONValue] = value;
    fs.writeFileSync(file, JSON.stringify(jsonData));
}

export function getConfigProperty(file: string, JSONvalue: string) {
    if (!file) {
        console.log("File not found.");
        return;
    }

    const data = fs.readFileSync(file, "utf8");
    const jsonData = JSON.parse(data);

    return jsonData[JSONvalue];
}

export function getThemes() {
    let themes: ThemeProperties[] = [];

    fs.readdir(themesFolder, (err, files) => {
        files.forEach((file) => {
            let data = fs.readFileSync(file, "utf8");
            let dataJSON = JSON.parse(data);
            let themeJSON: ThemeProperties = { ...dataJSON };
            themeJSON.setTheme = "placeholder";

            console.log(themeJSON);
        });
    });
}

export function saveTheme({
    name,
    author,
    textColor,
    headerColor,
    bodyColor,
    stripesColor,
    menuColor,
    titlebarColor,
    selectColor,
}: ThemeProperties) {
    console.log(name);
}
