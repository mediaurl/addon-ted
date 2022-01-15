import * as cheerio from "cheerio";

interface TedItem {
    title: string;
    speaker: string;
    thumbnail: string;
    link: string;
}

interface ExtendedTedItem {
    description: string;
    recorded: string;
    downloads: {
        id: number;
        nativeDownloads: {
            high: string;
            low: string;
            medium: string;
        };
    };
}

interface TedPlayerData {
    id: string;
    thumb: string;
    languages: {
        languageName: string;
        languageCode: string;
    }[];
    nativeLanguage: string;
    resources: {
        h264: {
            bitrate: number;
            file: string;
        }[];
    };
}

interface TedImage {
    __typename: "Image";
    url: string;
}

interface TedSpeaker {
    __typename: "Speaker";
    firstName: string;
    lastName: string;
}

interface TedVideoItem {
    __typename: "Video";
    id: string;
    slug: string;
    title: string;
    description: string;
    duration: number;
    publishedAt: string;
    primaryImageSet: TedImage[];
    speakers: TedSpeaker[];
    playerData: TedPlayerData;
}

export const parseList = async (html: string): Promise<TedItem[]> => {
    const results: TedItem[] = [];

    const $ = cheerio.load(html);

    $("div.talk-link").each((index, elem) => {
        const mediaMessageNode = $(elem).find(".media__message").first();
        const thumbnail = (
            $(elem).find("img.thumb__image").first().attr("src") as string
        )
            .split("?")
            .shift();

        const item: TedItem = {
            speaker: mediaMessageNode.children().first().text(),
            title: mediaMessageNode.children().eq(1).text().trim(),
            thumbnail: thumbnail || "",
            link: $(elem).find("a").first().attr("href") as string,
        };

        results.push(item);
    });

    return results;
};

export const parseItem = async (html: string): Promise<TedVideoItem> => {
    const $ = cheerio.load(html);

    const scriptData = $("script#__NEXT_DATA__").first().html();

    const dataObj = /{.*}/.exec(<string>scriptData);
    const parsed = JSON.parse((dataObj || [])[0]);

    const videoData = parsed.props.pageProps.videoData;

    return { ...videoData, playerData: JSON.parse(videoData.playerData) };
};
