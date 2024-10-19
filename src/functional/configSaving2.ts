import * as path from "@tauri-apps/api/path";
import { exists, readFile } from "@tauri-apps/plugin-fs";

const homedir = await path.homeDir();
const appPath = await path.join(homedir, "/.caughtin4k");
const configPath = await path.join(homedir, "/.caughtin4k/config");
const fontsPath = await path.join(homedir, "/.caughtin4k/fonts");
const themesPath = await path.join(homedir, "/.caughtin4k/themes");

export async function createConfigFile() {
    if (!(await exists("config", { baseDir: path.BaseDirectory.AppConfig })))
        return;
}

export async function testFunc() {
    console.log(await readFile(await path.join(themesPath, "default.json")));
}
