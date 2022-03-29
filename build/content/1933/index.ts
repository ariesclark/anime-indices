import { type Anime } from "../../";

import fall from "./fall.json" assert { type: "json" };
import spring from "./spring.json" assert { type: "json" };
import winter from "./winter.json" assert { type: "json" };

export const year = 1933;
// @ts-ignore
export const season: { fall: Anime[], spring: Anime[], winter: Anime[] } = { fall, spring, winter };