import matches from "lodash/matches.js"

import * as indices from "./indices/index.js";
import { tags } from "./tags.js";

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

export async function get (key: string): Promise<Anime> {
    const [year, seasonIndex] = key.split("/");
    const [season, index] = seasonIndex.split("#");

    const { default: value } = (await import(`./content/${year}/${season}.json`, {
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
        if (!(indexKey in indices)) throw new ReferenceError(`Invalid index key: ${indexKey}`);
        if (!value[indexKey]) continue;
        
       /*  if (Array.isArray(value[indexKey])) {

        } */

        // @ts-expect-error
        const animeKeys: string[] = indices[indexKey][value[indexKey]] || [];
        chunks.push(...await Promise.all(animeKeys.map(async (animeKey) => get(animeKey))));
    }

    console.log({ value });
    chunks = [...new Set(chunks.filter((anime) => {
        return matches(value)(anime);
    }))]

    return chunks;
}
