import { type Anime } from "../../";

import fall from "./fall.json";
import spring from "./spring.json";
import summer from "./summer.json";
import unknown from "./unknown.json";
import winter from "./winter.json";

export const year = 2013;
// @ts-ignore
export const season: { fall: Anime[], spring: Anime[], summer: Anime[], unknown?: Anime[], winter: Anime[] } = { fall, spring, summer, unknown, winter };