import { invoke } from "@tauri-apps/api/core";

function PlayerSearch() {
    let placeholder = "Search player";

    const searchPlayer = (event: any) => {
        if (event.key === "Enter") {
            invoke("add_player", { name: event.target.value });
        }
    };

    return (
        <div className="titlebar-playersearch">
            <input
                type="text"
                id="titlebar-playersearch-input"
                placeholder={placeholder}
                onKeyDown={searchPlayer}></input>
        </div>
    );
}

export default PlayerSearch;
