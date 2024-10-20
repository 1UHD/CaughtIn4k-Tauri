import { invoke } from "@tauri-apps/api/core";

function Session() {
    let sessionVisibility = true;

    const toggleVisibility = () => {
        const session = document.querySelector<HTMLElement>(
            ".sidebar-session-controls"
        );

        if (!session) {
            return;
        }

        if (sessionVisibility) {
            session.style.visibility = "hidden";
            session.style.position = "absolute";
            sessionVisibility = false;
        } else {
            session.style.visibility = "visible";
            session.style.position = "relative";
            sessionVisibility = true;
        }
    };

    const clearPlayers = () => {
        invoke("clear_players");
    };

    const refetchPlayers = () => {};

    const removePlayer = (event: any) => {
        if (event.key === "Enter") {
            invoke("remove_player", { name: event.target.value });
        }
    };

    return (
        <div className="sidebar-session">
            <h1 onClick={toggleVisibility}>SESSION</h1>
            <div className="sidebar-session-controls">
                <p
                    id="sidebar-session-controls-refetch"
                    onClick={refetchPlayers}>
                    Refetch players
                </p>
                <p id="sidebar-session-controls-clear" onClick={clearPlayers}>
                    Clear players
                </p>
                <input
                    type="text"
                    placeholder="Remove player"
                    onKeyDown={removePlayer}></input>
            </div>
        </div>
    );
}

export default Session;
