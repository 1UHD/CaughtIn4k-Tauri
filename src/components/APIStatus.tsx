import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";

function APIStatus() {
    const [mojangStatus, setMojangStatus] = useState("");
    const [hypixelStatus, setHypixelStatus] = useState("");
    //const [toggleArrow, setToggleArrow] = useState("[v]");

    let statusVisibility = true;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ONLINE":
                return "green";

            case "RATELIMITED":
                return "orange";

            case "INVALID APIKEY":
                return "red";

            case "OFFLINE":
                return "red";

            default:
                return "red";
        }
    };

    const toggleVisibility = () => {
        const statusdiv = document.querySelector<HTMLElement>(
            ".sidebar-apistatus-status"
        );

        if (!statusdiv) {
            return;
        }

        if (statusVisibility) {
            statusdiv.style.visibility = "hidden";
            statusdiv.style.position = "absolute";
            //setToggleArrow("[>]");
            statusVisibility = false;
        } else {
            statusdiv.style.visibility = "visible";
            statusdiv.style.position = "relative";
            //setToggleArrow("[v]");
            statusVisibility = true;
        }
    };

    useEffect(() => {
        const unlistenSetMojangAPI = listen<string>(
            "set-mojang-status",
            (event) => {
                const status = event.payload;
                setMojangStatus(status);
            }
        );

        const unlistenSetHypixelAPI = listen<string>(
            "set-hypixel-status",
            (event) => {
                const status = event.payload;
                setHypixelStatus(status);
            }
        );

        return () => {
            unlistenSetMojangAPI.then((unlisten) => unlisten());
            unlistenSetHypixelAPI.then((unlisten) => unlisten());
        };
    }, []);

    return (
        <div className="sidebar-apistatus">
            <h1 onClick={toggleVisibility}>API STATUS</h1>
            <div className="sidebar-apistatus-status">
                <p>
                    Mojang:{" "}
                    <span style={{ color: getStatusColor(mojangStatus) }}>
                        {mojangStatus ? mojangStatus : "UNKNOWN"}
                    </span>
                </p>
                <p>
                    Hypixel:{" "}
                    <span style={{ color: getStatusColor(hypixelStatus) }}>
                        {hypixelStatus ? hypixelStatus : "UNKNOWN"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default APIStatus;
