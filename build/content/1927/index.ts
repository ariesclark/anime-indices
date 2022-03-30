import { type Anime } from "../../";

import fall from "./fall.json";
import spring from "./spring.json";
import unknown from "./unknown.json";
import winter from "./winter.json";

export const year = 1927;
// @ts-ignore
export const season: { fall: Anime[], spring: Anime[], unknown?: Anime[], winter: Anime[] } = { fall, spring, unknown, winter };