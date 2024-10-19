import { useEffect, useRef, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { getStats } from "../functional/statsFetcher";

export interface PlayerProps {
    id: string;
    level: any;
    name: any;
    dname: string | undefined;
    fkdr: number | undefined;
    finals: number | undefined;
    wlr: number | undefined;
    wins: number | undefined;
    beds: number | undefined;
    bblr: number | undefined;
    kills: number | undefined;
    kdr: number | undefined;
    index: number | undefined;
    ws: number | undefined;
}

function PlayerCard({
    id,
    //level,
    name,
    kills,
    finals,
    beds,
    wins,
    fkdr,
    kdr,
    bblr,
    wlr,
}: //index,
//ws,
PlayerProps) {
    const api_link = `https://crafatar.com/renders/body/${id}?size=3&overlay`;
    const card_key = `playerlist-player-card-${id}`;

    return (
        <div className="playerlist-player-card" id={card_key}>
            <div className="playerlist-player-card-img">
                <img src={api_link} alt="player avatar" />
            </div>
            <div className="playerlist-player-card-stats">
                <h1>{name}</h1>
                <p>Kills: {kills}</p>
                <p>Finals: {finals}</p>
                <p>Beds: {beds}</p>
                <p>Wins: {wins}</p>
                <p>KDR: {kdr}</p>
                <p>FKDR: {fkdr}</p>
                <p>BBLR: {bblr}</p>
                <p>WLR: {wlr}</p>
            </div>
        </div>
    );
}

function Player({ id, level, name, finals, wins, fkdr, wlr }: PlayerProps) {
    let attributes = [level, name, finals, fkdr, wins, wlr];

    const player_skull = `https://crafatar.com/avatars/${id}?overlay`;
    const player_key = `playerlist-player-${id}`;
    const card_key = `playerlist-player-card-${id}`;

    let card_visibility = false;
    const toggleVisibility = () => {
        let card = document.querySelector<HTMLElement>("#" + card_key);
        let othercards = document.querySelectorAll<HTMLElement>(
            ".playerlist-player-card"
        );

        othercards.forEach((pcard) => {
            pcard.style.visibility = "hidden";
        });

        if (card) {
            if (!card_visibility) {
                card_visibility = true;
                card.style.visibility = "visible";
            } else {
                card_visibility = false;
                card.style.visibility = "hidden";
            }
        } else {
            console.error("Element not found:", card_key);
        }
    };

    return (
        <tr key={player_key} onClick={toggleVisibility}>
            <td>
                <img src={player_skull}></img>
            </td>
            {attributes.map((item) => (
                <td>{item}</td>
            ))}
        </tr>
    );
}

function PlayerList() {
    const attributes = ["LEVEL", "NAME", "FINALS", "FKDR", "WINS", "WLR"];
    const [players, setPlayers] = useState<PlayerProps[]>([]);
    const playersRev = useRef<PlayerProps[]>(players);

    const checkIfPlayerAlreadyInList = (name: string) => {
        return playersRev.current.some(
            (player) => player.dname?.toLowerCase() === name.toLowerCase()
        );
    };

    useEffect(() => {
        playersRev.current = players;
    }, [players]);

    useEffect(() => {
        const unlistenAddPlayer = listen<string>(
            "add-player",
            async (event) => {
                const playerName = event.payload;
                const playerExists = await checkIfPlayerAlreadyInList(
                    playerName
                );
                console.log(playerExists);

                if (playerExists) {
                    return;
                }

                const playerStats = await getStats(playerName);
                setPlayers((prevPlayers) => [...prevPlayers, playerStats]);
            }
        );

        const unlistenRemovePlayer = listen<string>(
            "remove-player",
            (event) => {
                const playerName = event.payload;
                setPlayers((prevPlayers) =>
                    prevPlayers.filter(
                        (p) =>
                            p.dname?.toLowerCase() !== playerName.toLowerCase()
                    )
                );
            }
        );

        const unlistenClearPlayers = listen("clear-players", () => {
            setPlayers([]);
        });

        return () => {
            unlistenAddPlayer.then((unlisten) => unlisten());
            unlistenRemovePlayer.then((unlisten) => unlisten());
            unlistenClearPlayers.then((unlisten) => unlisten());
        };
    }, []);

    return (
        <div className="playerlist">
            <table className="playerlist-table">
                <tr>
                    <th id="playerlist-table-skulls"></th>
                    {attributes.map((header) => (
                        <th>{header}</th>
                    ))}
                </tr>
                {players.map((player) =>
                    players ? <Player {...player} /> : null
                )}
            </table>
            {players.map((player) =>
                players ? <PlayerCard {...player} /> : null
            )}
        </div>
    );
}

export default PlayerList;
