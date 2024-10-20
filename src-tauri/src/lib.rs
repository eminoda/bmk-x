use std::process::Command;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command(rename_all = "snake_case")]
fn open_app_link(url: &str) -> String {
    let command = Command::new("explorer")
        .arg(url)
        .spawn()
        .map_err(|e| format!("Failed to start explorer process: {}", e))
        .and_then(|mut child| {
            child
                .wait()
                .map_err(|e| format!("Failed to wait for explorer process: {}", e))
        });

    match command {
        Ok(status) => match status.code() {
            Some(code) => {
                if code == 0 {
                    "Success".to_string()
                } else {
                    format!("Failed with code: {}", code)
                }
            }
            None => "Terminated by a signal".to_string(),
        },
        Err(err) => err,
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![greet, open_app_link])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
