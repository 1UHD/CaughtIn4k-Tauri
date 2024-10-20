// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
use tauri::{Emitter, Manager};

#[tauri::command]
fn set_mojang_status(app_handle: tauri::AppHandle, status: String) {
    app_handle.emit("set-mojang-status", status).unwrap();
}

#[tauri::command]
fn set_hypixel_status(app_handle: tauri::AppHandle, status: String) {
    app_handle.emit("set-hypixel-status", status).unwrap();
}

#[tauri::command]
fn reset_theme(app_handle: tauri::AppHandle) {
    app_handle.emit("reset-theme", ()).unwrap();
}

#[tauri::command]
fn add_player(app_handle: tauri::AppHandle, name: String) {
    app_handle.emit("add-player", name).unwrap();
}

#[tauri::command]
fn remove_player(app_handle: tauri::AppHandle, name: String) {
    app_handle.emit("remove-player", name).unwrap();
}

#[tauri::command]
fn clear_players(app_handle: tauri::AppHandle) {
    app_handle.emit("clear-players", ()).unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            add_player,
            remove_player,
            clear_players,
            set_mojang_status,
            set_hypixel_status,
            reset_theme
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
