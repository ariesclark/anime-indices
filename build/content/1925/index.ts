import { type Anime } from "../../";

import unknown from "./unknown.json" assert { type: "json" };
import winter from "./winter.json" assert { type: "json" };

export const year = 1925;
// @ts-ignore
export const season: { unknown?: Anime[], winter: Anime[] } = { unknown, winter };