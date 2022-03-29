import { type Anime } from "../../";

import fall from "./fall.json" assert { type: "json" };
import spring from "./spring.json" assert { type: "json" };
import unknown from "./unknown.json" assert { type: "json" };
import winter from "./winter.json" assert { type: "json" };

export const year = 1958;
// @ts-ignore
export const season: { fall: Anime[], spring: Anime[], unknown?: Anime[], winter: Anime[] } = { fall, spring, unknown, winter };