import { ActionHandlers } from "@mediaurl/sdk";
import * as qs from "qs";
import { parseItem, parseList } from "./ted-scraper";

export const catalogHandler: ActionHandlers["catalog"] = async (input, ctx) => {
    await ctx.requestCache([input.search, input.filter, input.cursor], {
        ttl: Infinity,
        refreshInterval: "1h",
    });

    const { fetch } = ctx;
    const cursor: number = <number>input.cursor || 1;

    const queryString = qs.stringify(
        {
            page: cursor,
            q: input.search || undefined,
            ...input.filter,
        },
        { arrayFormat: "brackets" }
    );

    const url = "https://www.ted.com/talks?" + queryString;

    const results = await fetch(url).then(async (resp) => {
        return parseList(await resp.text());
    });

    console.log("XXX", url, results.length, cursor);

    return {
        nextCursor: results.length >= 36 ? cursor + 1 : null,
        items: results.map((item) => {
            const id = item.link;
            return {
                id,
                ids: { id },
                type: "movie",
                name: `${item.title}`,
                images: {
                    poster: item.thumbnail,
                },
            };
        }),
    };
};

export const itemHandler: ActionHandlers["item"] = async (input, ctx) => {
    // await ctx.requestCache([input.ids.id, input.name], {
    //     ttl: Infinity,
    //     refreshInterval: "1h",
    // });

    const { fetch } = ctx;

    const url = "https://www.ted.com" + input.ids.id;

    const result = await fetch(url).then(async (resp) =>
        parseItem(await resp.text())
    );

    return {
        type: "movie",
        ids: input.ids,
        name: input.name || result.title,
        description: result.description,
        releaseDate: result.publishedAt,
        sources: [
            {
                type: "url",
                url: result.playerData.resources.h264[0].file,
            },
        ],
        images: {
            poster: result.playerData.thumb,
        },
    };
};
