import { spawnSync } from "child_process";
import * as readline from "readline";
import fs from "fs/promises";
import crypto from "crypto";
import util from "util";
import path from "path";
import ms from "ms";

import fetch from "node-fetch";
//import { Anime, AnimeSeason } from "../src";
import { performance } from "perf_hooks";

function normalizeContent (content: any): any[] {
    return (content.data as any[]).map<any>((anime) => {
        anime.date = anime.animeSeason;
        delete anime.animeSeason;

        anime.status = anime.status.toLowerCase();
        anime.type = anime.type.toLowerCase();
        
        anime.date.season = anime.date.season.toLowerCase();
        anime.date.year ??= null;

        // every other string enum uses "unknown" instead of "undefined", so why should this one be the exception?
        if (anime.date.season === "undefined") anime.date.season = "unknown";

        return anime;
    }).sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
    })
}

async function getContent (): Promise<any[]> {
    const url = "https://raw.githubusercontent.com/manami-project/anime-offline-database/master/anime-offline-database-minified.json";
    return normalizeContent(await fetch(url).then((response) => response.json()));
}

const hash = (value: string) => crypto.createHash("sha256").update(value).digest("hex");
const serialize = (value: unknown): string => util.inspect(value, { depth: Infinity, maxArrayLength: Infinity, maxStringLength: Infinity, compact: false });
const formatMs = (value: number): string => value < 1000 ? `${value.toFixed(2)}ms` : ms(value, { long: false });

const normalize = (value: any): string => {
    if (typeof value === "string") return value.toLowerCase().replace(/[\s.\-\'\"]/g, "");
    return value.toString();
}

const startTime = performance.now();

let lastDraw: string = "";
let lastDrawTime = startTime;

const draw = (value: string): void => {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);

    const message = `t: ${formatMs(performance.now() - startTime)}, c: ${formatMs(performance.now() - lastDrawTime)} - ${value}`;
    process.stdout.write(message);

    if (value !== lastDraw) {
        lastDraw = value;
        lastDrawTime = performance.now();
    }
}

const interval = setInterval(() => {
    draw(lastDraw);
}, 10);

(async () => {
    const forced = process.argv.slice(2).includes("--force");
    draw(`building content`);

    await fs.mkdir(path.resolve("./build/content"), { recursive: true }).catch(() => {});
    await fs.mkdir(path.resolve("./build/indices")).catch(() => {});

    draw("downloading latest content...");
    const content = (await getContent())/* .slice(0, 1000) */;

    const buildHashPath = path.resolve("./build/.sha256");
    const lastBuildHash = await fs.readFile(buildHashPath, "utf-8").catch(() => "");

    const hashedContent = hash(JSON.stringify(content));

    if ((lastBuildHash === hashedContent) && !forced) {
        clearInterval(interval);

        draw("update skipped, no new content available.");
        return;
    }

    draw(`updates available${forced ? " (forced)" : ""}, building new content...`);
    await fs.writeFile(buildHashPath, hashedContent);

    const indexMap: Record<string, Record<string, string[]>> = {};
    const contentMap: Record<string, Record<string, any[]>> = {};
    const tagSet: Set<string> = new Set();

    for (let i = 0; i < content.length; i += 1) {
        const entry = content[i];
        
        const year = (entry.date.year || "unknown").toString();
        const season = entry.date.season;

        contentMap[year] ??= {};
        contentMap[year][season] ??= [];
        contentMap[year][season].push(entry);
    }

    for (const year in contentMap) {
        const contentYearPath = path.resolve("./build/content", year);
        await fs.mkdir(contentYearPath, { recursive: true }).catch(() => {});

        const yearSeasons = Object.keys(contentMap[year]).sort();

        for (const season of yearSeasons) {
            const contentSeasonPath = path.resolve(contentYearPath, `${season}.json`);
            const seasonContent = contentMap[year][season];

            for (const animeIndex in seasonContent) {
                const anime = seasonContent[animeIndex];
                const animeKey = `${year}/${season}#${animeIndex}`;
                anime.tags.map((value: string) => tagSet.add(value));

                draw(`indexing (${animeIndex}/${seasonContent.length} - ${season}/${year}): ${anime.title}`);
                const ignoredIndices = ["sources", "relations", "episodes", "date", "thumbnail", "picture"];
                for (const indexKey of Object.keys(anime)) {
                    if (ignoredIndices.includes(indexKey)) continue;
                    indexMap[indexKey] ??= {};
                    
                    let keyValue = Array.isArray(anime[indexKey]) 
                        ? anime[indexKey] : [anime[indexKey]];
                    
                    keyValue.forEach((value: any) => {
                        const normalizedValue = normalize(value);
                        indexMap[indexKey][normalizedValue] ??= [];
                        indexMap[indexKey][normalizedValue].push(animeKey)
                    });
                }
            }
            

            await fs.writeFile(contentSeasonPath, JSON.stringify(seasonContent, null, 4));
        }

        const yearIndexFileContent = `\
import { type Anime } from "../../";

${yearSeasons.map((season) => `import ${season} from "./${season}.json" assert { type: "json" };`).join("\n")}

export const year = ${year === "unknown" ? null : year};
// @ts-ignore
export const season: { ${yearSeasons.map((season) => `${season}${season === "unknown" ? "?:" : ":"} Anime[]`).join(", ")} } = { ${yearSeasons.join(", ")} };\
`;
        
        await fs.writeFile(path.resolve(contentYearPath, "index.ts"), yearIndexFileContent);
    }

    draw(`writing ${Object.keys(indexMap).length} indices to file`)
    for (const indexKey of Object.keys(indexMap)) {
        await fs.writeFile(path.resolve("./build/indices/", `${indexKey}.json`), JSON.stringify(indexMap[indexKey], null, 4));
    }

    const indicesIndexFileContent = `\
${Object.keys(indexMap).map((indexKey) => `export { default as ${indexKey} } from "./${indexKey}.json" assert { type: "json" };`).join("\n")}\
`;
        
    await fs.writeFile(path.resolve("./build/indices/", "index.ts"), indicesIndexFileContent);

    await fs.writeFile(path.resolve("./build/tags.ts"), `\
export const tags = ${serialize([...tagSet].sort())} as const;\
`);

    await fs.writeFile(path.resolve("./build/index.ts"), `\
import * as indices from "./indices";
import { tags } from "./tags";

export const types = ["tv", "movie", "ova", "ona", "special", "unknown"] as const;
export type AnimeType = typeof types[number]

export const statuses = ["finished", "ongoing", "upcoming", "unknown"] as const;
export type AnimeStatus = typeof statuses[number];

export const seasons = ["spring", "summer", "fall", "winter", "unknown"] as const;
export type AnimeSeason = typeof seasons[number];

export type AnimeTag = typeof tags[number]

export interface Anime {
    sources: string[]
    title: string
    type: AnimeType
    episodes: number
    status: AnimeStatus
    date: {
        season: AnimeSeason
        year: number | null
    }
    picture: string
    thumbnail: string
    synonyms: string[]
    relations: string[]
    tags: AnimeTag[]
}

const normalize = ${normalize.toString()};

export async function get (key: string): Promise<Anime> {
    const [year, seasonIndex] = key.split("/");
    const [season, index] = seasonIndex.split("#");

    const { default: value } = (await import(\`./content/\${year}/\${season}.json\`, {
        assert: { type: "json" }
    }));

    return value[index];
}

type FindIteratee = (anime: Anime) => boolean;

export async function find (partial: Partial<Anime>): Promise<Anime[]>;
/** This function is vastly slower than searching using partials, consider using that overload instead. */
export async function find (iteratee: FindIteratee): Promise<Anime[]>;

export async function find (value: FindIteratee | Partial<Anime>): Promise<Anime[]> {
    if (typeof value === "function") return [];
    let chunks: Anime[] = [];
    
    for (const indexKey of Object.keys(value) as (keyof typeof indices)[]) {
        if (!(indexKey in indices)) throw new ReferenceError(\`Invalid index key: \${indexKey}\`);
        if (!value[indexKey]) continue;
        
       /*  if (Array.isArray(value[indexKey])) {

        } */

        // @ts-expect-error
        const animeKeys: string[] = indices[indexKey][value[indexKey]] || [];
        chunks.push(...await Promise.all(animeKeys.map(async (animeKey) => get(animeKey))));
    }

    console.log({ value });
    chunks = [...new Set(chunks.filter((anime) => {
        return _.matches(value)(anime);
    }))]

    return chunks;
}
`);
    //await fs.copyFile(path.resolve("./src/index.ts"), path.resolve("./build/index.ts"))

    draw("task completed");
    clearInterval(interval);
})();
