import { type Anime } from "../../";

import fall from "./fall.json";
import unknown from "./unknown.json";
import winter from "./winter.json";

export const year = 1941;
// @ts-ignore
export const season: { fall: Anime[], unknown?: Anime[], winter: Anime[] } = { fall, unknown, winter };