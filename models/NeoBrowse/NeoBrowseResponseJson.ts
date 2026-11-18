import { BrowseLinksJson } from "./BrowseLinksJson";
import { PageJson } from "./PageJson";
import { BrowseNeoJson } from "./BrowseNeoJson";

export interface NeoBrowseResponseJson {
  links: BrowseLinksJson;
  near_earth_objects: BrowseNeoJson[];
  page: PageJson;
}