import { fetch } from "@tauri-apps/plugin-http";
import { PlayerProps } from "../components/PlayerList";
import { formatRank, formatStars } from "./statsFormatter";
import { invoke } from "@tauri-apps/api/core";

const ApiKey = "77b7e69f-6743-438c-9be2-2bce00508229";
let MojangAPIAvailablity = "ONLINE";
let HypixelAPIAvailablity = "ONLINE";

function getUUID(playerName: string) {
    return fetch(
        `https://api.mojang.com/users/profiles/minecraft/${playerName}`,
        { method: "GET" }
    ).then((response) => {
        if (response.status === 429) {
            MojangAPIAvailablity = "RATELIMITED";
        } else if (response.status === 200) {
            MojangAPIAvailablity = "ONLINE";
        } else {
            MojangAPIAvailablity = "OFFLINE";
        }

        invoke("set_mojang_status", { status: MojangAPIAvailablity });
        return response.json();
    });
}

function getHypixelStats(uuid: string, ApiKey: string) {
    if (MojangAPIAvailablity !== "ONLINE") {
        return;
    }

    return fetch(`https://api.hypixel.net/player?key=${ApiKey}&uuid=${uuid}`, {
        method: "GET",
    }).then((response) => {
        if (response.status === 429) {
            HypixelAPIAvailablity = "RATELIMITED";
        } else if (response.status === 200) {
            HypixelAPIAvailablity = "ONLINE";
        } else if (response.status === 403) {
            HypixelAPIAvailablity = "INVALID APIKEY";
        } else {
            HypixelAPIAvailablity = "OFFLINE";
        }

        invoke("set_hypixel_status", { status: HypixelAPIAvailablity });
        return response.json();
    });
}

export async function getStats(playerName: string): Promise<PlayerProps> {
    let player: PlayerProps;
    const nick: PlayerProps = {
        id: "ff99328f-e0ca-45c2-8b86-969052b1d521",
        level: undefined,
        name: formatRank(
            undefined,
            undefined,
            undefined,
            `[NICK] ${playerName}`
        ),
        dname: playerName,
        fkdr: undefined,
        finals: undefined,
        wlr: undefined,
        wins: undefined,
        beds: undefined,
        bblr: undefined,
        kills: undefined,
        kdr: undefined,
        index: undefined,
        ws: undefined,
    };

    let uuid;
    let data;

    try {
        uuid = await getUUID(playerName);
        data = await getHypixelStats(uuid.id, ApiKey);
    } catch (e) {
        return nick;
    }

    if (
        HypixelAPIAvailablity !== "ONLINE" ||
        MojangAPIAvailablity !== "ONLINE"
    ) {
        return nick;
    }
    try {
        const star = data.player.achievements.bedwars_level;
        const finals = data.player.stats.Bedwars.final_kills_bedwars;
        const finaldeaths = data.player.stats.Bedwars.final_deaths_bedwars;
        const fkdr = parseFloat((finals / finaldeaths).toFixed(2));

        const kills = data.player.stats.Bedwars.kills_bedwars;
        const deaths = data.player.stats.Bedwars.deaths_bedwars;
        const kdr = parseFloat((kills / deaths).toFixed(2));

        const beds = data.player.stats.Bedwars.beds_broken_bedwars;
        const bedslost = data.player.stats.Bedwars.beds_lost_bedwars;
        const bblr = parseFloat((beds / bedslost).toFixed(2));

        const wins = data.player.stats.Bedwars.wins_bedwars;
        const losses = data.player.stats.Bedwars.losses_bedwars;
        const wlr = parseFloat((wins / losses).toFixed(2));

        const winstreak = data.player.stats.Bedwars.winstreak;
        const name = data.player.displayname;
        const rank = data.player.newPackageRank;
        const monthlyPackageRank = data.player.monthlyPackageRank;
        const staffRank = data.player.rank;

        const index = Math.round((star * fkdr * fkdr) / 10);

        const formattedName = formatRank(
            rank,
            monthlyPackageRank,
            staffRank,
            name
        );
        const formattedStars = formatStars(star);

        player = {
            id: uuid.id,
            level: formattedStars,
            name: formattedName,
            dname: name,
            fkdr: fkdr,
            finals: finals,
            wlr: wlr,
            wins: wins,
            beds: beds,
            bblr: bblr,
            kills: kills,
            kdr: kdr,
            index: index,
            ws: winstreak,
        };
    } catch (error) {
        return nick;
    }

    return player;
}
