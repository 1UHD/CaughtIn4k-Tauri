const star_colors = [
    ["gray"],
    ["white"],
    ["gold"],
    ["aqua"],
    ["green"],
    ["#009088"],
    ["#c00000"],
    ["#ff5dff"],
    ["#5f5fff"],
    ["purple"],
    ["#ff5e5e", "gold", "yellow", "#6aff6a", "aqua", "#ff5dff", "purple"],
];

function formatToSpan(texts: string[], colors: string[]): JSX.Element {
    return (
        <>
            {texts.map((item, index) => (
                <span key={index} style={{ color: colors[index] }}>
                    {item}
                </span>
            ))}
        </>
    );
}

export function formatStars(star: number) {
    const prestige = Math.floor(star / 100);
    let stars = `[${star}✫]`;

    if (prestige < 10) {
        return formatToSpan([stars], star_colors[prestige]);
    } else {
        return formatToSpan(stars.split(""), star_colors[10]);
    }
}

export function formatRank(
    rank: any,
    monthlyPackageRank: any,
    staffRank: any,
    name: string
) {
    let shownRank = "";

    if (staffRank && staffRank !== "NONE") {
        shownRank = staffRank;
    } else if (monthlyPackageRank && monthlyPackageRank !== "NONE") {
        shownRank = monthlyPackageRank;
    } else if (rank && rank !== "NONE") {
        shownRank = rank;
    } else {
        shownRank = "NON";
    }

    switch (shownRank) {
        case "YOUTUBER":
            return formatToSpan(
                ["[", "Y", "O", "U", "T", "U", "B", "E", "] ", name],
                [
                    "#ff5e5e",
                    "white",
                    "white",
                    "white",
                    "white",
                    "white",
                    "white",
                    "white",
                    "#ff5e5e",
                    "#ff5e5e",
                ]
            );

        case "GAME_MASTER":
            return formatToSpan(["[GM] ", name], ["green", "green"]);

        case "ADMIN":
            return formatToSpan(["[ADMIN] ", name], ["#ff5e5e", "#ff5e5e"]);

        case "SUPERSTAR":
            return formatToSpan(
                ["[", "M", "V", "P", "+", "+", "] ", name],
                [
                    "gold",
                    "gold",
                    "gold",
                    "gold",
                    "#ff5e5e",
                    "#ff5e5e",
                    "gold",
                    "gold",
                ]
            );

        case "MVP_PLUS":
            return formatToSpan(
                ["[", "M", "V", "P", "+", "] ", name],
                ["aqua", "aqua", "aqua", "aqua", "#ff5e5e", "aqua", "aqua"]
            );

        case "MVP":
            return formatToSpan(["[MVP] ", name], ["aqua", "aqua"]);

        case "VIP_PLUS":
            return formatToSpan(
                ["[", "V", "I", "P", "+", "] ", name],
                [
                    "#6aff6a",
                    "#6aff6a",
                    "#6aff6a",
                    "#6aff6a",
                    "gold",
                    "#6aff6a",
                    "#6aff6a",
                ]
            );

        case "VIP":
            return formatToSpan(["[VIP] ", name], ["#6aff6a", "#6aff6a"]);

        case "NON":
            return formatToSpan([name], ["gray"]);

        default:
            return formatToSpan([name], ["yellow"]);
    }
}
