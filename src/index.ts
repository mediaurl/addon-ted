import { createAddon, runCli } from "@mediaurl/sdk";
import { catalogHandler, itemHandler } from "./handlers";

export const tedAddon = createAddon({
    id: "ted",
    name: "TED",
    description: "Ideas worth spreading",
    icon: "https://www.ted.com/favicon.ico",
    version: "0.0.0",
    itemTypes: ["movie"],
    catalogs: [
        {
            features: {
                search: { enabled: true },
            },
            options: {
                imageShape: "landscape",
                displayName: true,
            },
        },
    ],
});

tedAddon.registerActionHandler("catalog", catalogHandler);

tedAddon.registerActionHandler("item", itemHandler);

runCli([tedAddon], { singleMode: true });
