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
                filter: [
                    {
                        id: "language",
                        name: "Language",
                        values: [
                            { value: "English", key: "en" },
                            { value: "Español", key: "es" },
                            { value: "日本語", key: "ja" },
                            { value: "Português brasileiro", key: "pt-br" },
                            { value: "中文 (繁體)", key: "zh-tw" },
                            { value: "한국어", key: "ko" },
                        ],
                    },
                    {
                        id: "duration",
                        name: "Duration",
                        values: [
                            { value: "0–6 minutes", key: "0-6" },
                            { value: "6–12 minutes", key: "6-12" },
                            { value: "12–18 minutes", key: "12-18" },
                            { value: "18+ minutes", key: "18+" },
                        ],
                    },
                    {
                        id: "topics",
                        name: "Topics",
                        multiselect: true,
                        values: [
                            { value: "Technology", key: "Technology" },
                            { value: "Entertainment", key: "Entertainment" },
                            { value: "Design", key: "Design" },
                            { value: "Business", key: "Business" },
                            { value: "Science", key: "Science" },
                            { value: "Global issues", key: "Global issues" },
                        ],
                    },
                ],
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
