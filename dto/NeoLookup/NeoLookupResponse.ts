import { EstimatedDiameterJson } from "./EstimatedDiameterJson";
import { CloseApproachJson } from "./CloseApproachJson";
import { OrbitalDataJson } from "./OrbitalDataJson";

export interface NeoLookupResponseJson {
  absolute_magnitude_h: number;
  close_approach_data: CloseApproachJson[];
  designation: string;
  estimated_diameter: EstimatedDiameterJson;
  id: string;
  is_potentially_hazardous_asteroid: boolean;
  is_sentry_object: boolean;
  links: { self: string };
  name: string;
  nasa_jpl_url: string;
  neo_reference_id: string;
  orbital_data: OrbitalDataJson;
}