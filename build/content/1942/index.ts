import { type Anime } from "../../";

import summer from "./summer.json";
import unknown from "./unknown.json";
import winter from "./winter.json";

export const year = 1942;
// @ts-ignore
export const season: { summer: Anime[], unknown?: Anime[], winter: Anime[] } = { summer, unknown, winter };