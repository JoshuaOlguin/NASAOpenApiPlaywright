import { CloseApproachDataJson } from "./CloseApproachDataJson";
import { EstimatedDiameterJson } from "./EstimatedDiameterJson";
import { OrbitalDataJson } from "./OrbitalDataJson";

export interface BrowseNeoJson {
    absolute_magnitude_h: number;
    close_approach_data: CloseApproachDataJson[];
    designation: string;
    estimated_diameter: EstimatedDiameterJson;
    id: string;
    is_potentially_hazardous_asteroid: boolean;
    is_sentry_object: boolean;
    links: { self: string };
    name: string;
    name_limited: string;
    nasa_jpl_url: string;
    neo_reference_id: string;
    orbital_data: OrbitalDataJson;
}