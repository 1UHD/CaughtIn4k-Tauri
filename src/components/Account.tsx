import { useEffect, useState } from "react";
import { PlayerProps } from "./PlayerList";
import { getStats } from "../functional/statsFetcher";

export let personalStats: PlayerProps | undefined;

function Account() {
    let acc = "iUHD";

    const [accountName, setAccountName] = useState<string | undefined>("???");
    const [skinFace, setSkinFace] = useState<string | undefined>(undefined);

    useEffect(() => {
        const getLoggedPlayer = async () => {
            if (acc === "") {
                return;
            }
            const playerStats: PlayerProps = await getStats(acc);
            personalStats = playerStats;
            setAccountName(playerStats.dname);
            setSkinFace(
                `https://crafatar.com/avatars/${playerStats.id}?overlay`
            );
        };

        return () => {
            getLoggedPlayer();
        };
    }, []);

    return (
        <div className="sidebar-account">
            <img
                src={
                    skinFace
                        ? skinFace
                        : "https://crafatar.com/avatars/ff99328f-e0ca-45c2-8b86-969052b1d521?overlay"
                }></img>
            <div className="sidebar-account-details">
                <h1 id="sidebar-account-details-name">{accountName}</h1>
                <p id="sidebar-account-details-session">Session Stats</p>
            </div>
        </div>
    );
}
export default Account;
