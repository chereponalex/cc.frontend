import { FormEssenceLineMeter, FormEssenceMetroStation } from "@/@types/form";
import { Request } from "@/@types/index";

export interface UpdateLineMeterResponse extends FormEssenceLineMeter {
  id: string;
}

export interface UpdateMetroStationResponse extends FormEssenceMetroStation {
  id: string;
  time_on_car?: number | null;
  time_on_foot?: number | null;
  real_estate_building_id?: string;
  metro_station_id: string;
}
export type RequestFilterType = "GET" | "PUT";
export interface RtkRequest {
  body: Request;
  method: RequestFilterType;
}
