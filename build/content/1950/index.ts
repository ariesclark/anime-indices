import { type Anime } from "../../";

import fall from "./fall.json" assert { type: "json" };
import unknown from "./unknown.json" assert { type: "json" };
import winter from "./winter.json" assert { type: "json" };

export const year = 1950;
// @ts-ignore
export const season: { fall: Anime[], unknown?: Anime[], winter: Anime[] } = { fall, unknown, winter };