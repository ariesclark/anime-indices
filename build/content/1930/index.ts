import { type Anime } from "../../";

import fall from "./fall.json";
import spring from "./spring.json";
import winter from "./winter.json";

export const year = 1930;
// @ts-ignore
export const season: { fall: Anime[], spring: Anime[], winter: Anime[] } = { fall, spring, winter };