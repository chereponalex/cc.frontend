import { Paginate } from "@/@types/paginate";
import { UseQueryStateResult } from "@reduxjs/toolkit/dist/query/react/buildHooks";

export interface SelectInfoCountry {
  label: string;
  value: string;
  regions: {
    label: string;
    value: string;
    cities: { label: string; value: string }[];
  }[];
}

export interface SelectInfoOfferCombined {
  combinedSelect: {
    label: string;
    value: string;
    realEstateBuildings: {
      label: string;
      value: string;
      developer: { label: string; value: string }[];
    }[];
  };
}

export interface SelectInfoEmployeeCombined {
  combinedSelect: {
    label: string;
    value: string;
    realEstateBuildings: {
      label: string;
      value: string;
      developer: { label: string; value: string }[];
    }[];
  };
  roles: {
    label: string;
    value: string;
  };
  statuses: {
    label: string;
    value: string;
  };
}

export interface SelectInfo {
  label: string;
  value: string;
}

export enum StatusTransfer {
  CALL_ONLINE = "Клиент разговаривает",
  CALL_FAILED = "Разговор не состоялся",
  TRANSFER_FAILED = "Перевод не состоялся",
  CALL_SUCCESS = "Разговор состоялся",
}

export enum StatusReconnected {
  NO = "Нет",
  YES = "Да",
}

export enum TypeField {
  IMG = "img",
  DEFAULT = "default",
  ICON = "icon",
  COLOR = "color",
}

export enum TypeFilter {
  NUMBER = "number",
  DATE_PICKER = "date",
  DATE = "date-time-interval",
  CHECKBOX = "dropdown-checkbox",
  CHECKBOX_SINGLE = "checkbox",
  RANGE = "number-interval",
  INPUT = "input",
  SELECT = "select",
  GROUP_CHECKBOX = "group-checkbox",
}

export enum TableTextConst {
  EMPLOYEE = "employee",
  OBJECT = "object",
  REAL_ESTATE_OBJECT = "real_estate_object",
  TRANSFER = "transfer",
  DEVELOPERS = "developer",
  BLACK_LIST = "black_list",
  REALESTATEBUILDING = "real_estate_building",
  RESIDENTIAL_COMPLEXES = "residentialComplexes",
  VENUE = "marketplace",
  PAYMENT_METHOD = "payment_method",
  STOCK = "stock",
  CITY = "city",
  COUNTRY = "country",
  REGION = "region",
  OFFER = "offer",
  ROLE = "role",
  WORK_TIME = "work_time",
  METRO_LINE = "metro_line",
  METRO_STATION = "metro_station",
  SETTINGS = "settings",
  SCRIPT = "script",
  TAG = "tag",
  GROUPS = "groups",
  QUESTION = "question",
  ACCESS_DENIED = "access_denied",
}

export interface CountryOption {
  label: string;
  dialCode: string;
  value: string;
}

export interface SvgProps {
  color?: string;
}

export interface PieChartProps {
  parts: number;
  color: string[];
  fill_degree: number;
}

export interface Option {
  label: string;
  value: string;
}

export interface Sorts {
  label: string;
  type: string;
}

export interface Filter {
  label: string;
  name: string;
  options: Option[];
  placeholder: string | null;
  type: TypeFilter;
}

export interface CustomErrorResponse {
  [key: string]: string[];
}

export interface Response<T> {
  data?: T;
  filters: Filter[];
  paginate: Paginate;
  error: boolean | CustomErrorResponse;
  message: string;
  code: number;
  success: boolean;
  sorts: Sorts;
  info?: any;
  city?: any;
}

export interface Request {
  [key: string]: number | string;
}

export interface EntityLink {
  url: string;
  title: string;
  method: string;
  permission_key: string;
}

export interface EntityLinks {
  view?: EntityLink;
  restore?: EntityLink;
  update?: EntityLink;
  delete_soft?: EntityLink;
  delete_hard?: EntityLink;
}

export interface Entity {
  id: string;
  name?: string | null;
  text?: string | null;
  full_name?: string | null;
  int_id: number;
  links: EntityLinks;
}

export interface Role extends Entity {
  name: string;
  default_page: string;
  deleted: boolean;
  updated: boolean;
  permissions?: any;
}

export interface City extends Entity {
  name: string;
  latitude: number;
  longitude: number;
  location: string;
  region: Region | null;
  country: Country | null;
}

export interface Country extends Entity {
  name: string;
}

export interface RealEstateObject extends Entity {
  name: string;
}

export interface Region extends Entity {
  name: string;
  country: Country | null;
}

export interface Developer extends Entity {
  name: string;
}

export interface Tag extends Entity {
  name: string;
}

export interface WorkTime extends Entity {
  offer: Offer;
  city: City;
  region: Region;
  country: Country;
  days: any;
  developer: Developer;
  end: string | null;
  start: string | null;
  is_active?: boolean;
  offer_id?: string;
  day?: number;
}

export interface Marketplace extends Entity {
  name: string;
  developers?: Developer[];
  expert_mode: boolean | null;
}

export interface MetroLine extends Entity {
  name: string;
  color: string;
  city: City | null;
  region: Region | null;
  country: Country | null;
  line_type: EnumType;
}

export interface Transfer extends Entity {
  city?: Entity | null;
  region?: Entity | null;
  country?: Entity | null;
  employee: Entity | null;
  marketplace: Entity | null;
  developer: Entity | null;
  offer: Entity | null;
  real_estate_building: Entity | null;
  staff_id: number;
  manager: Entity | null;
  team_leader?: Entity | null;
  phone: string;
  emolument: number;
  script: Entity | null;
  call_id: string;
  status: EnumType;
  records: string[];
  reconnected: boolean;
}

export interface Report {
  data: boolean;
  message: string;
  comment: string;
  success: boolean;
  error: boolean;
  code: number;
}

export interface Marketplace extends Entity {
  name: string;
}

export interface MetroStation extends Entity {
  name: string;
  line: MetroLine;
  city: City;
  cities: any;
  metro_lines: any;
  time_on_car: number;
  time_on_foot: number;
}
export interface Setting extends Entity {
  name: string;
  key: string;
  value: string;
}
export interface Script extends Entity {
  name: string;
  text: string;
  questions: Question[];
  script_locations?: { [key: string]: string };
  types?: { [key: string]: string };
}

export interface Sale extends Entity {
  name: string;
  stockLink: string;
}

export interface PaymentMethod extends Entity {
  name: string;
  payment_method_id: string;
}

export interface BlackList extends Entity {
  phone: string;
  employee: Employee;
}

export interface EnumType {
  key: string;
  value: string | number | boolean;
}

export interface BuildingObject extends Entity {
  price: number;
  square: number;
  price_per_meter: number;
  finishing: EnumType;
  roominess: EnumType;
  type: EnumType;
  deadline: EnumType;
  real_estate_building: RealEstateBuilding;
  is_region: boolean;
}

export interface Question extends Entity {
  reply: string;
}

export interface Offer extends Entity {
  developer: Developer;
  city: City;
  region: Region;
  country: Country;
  is_active: boolean;
  name: string;
  real_estate_building: RealEstateBuilding;
  work_time: any[];
  priority: number | string | null;
  expert_mode: boolean;
  marketplace: Marketplace;
  script: Script;
  price: number;
  operator_award: number;
  sip_uri: string;
  uniqueness_period: number;
  limit: number;
  not_looking_for_himself: boolean;
  client_is_out_of_town: boolean;
  scripts: Script[];
  external_id: string;
}

export interface Employee extends Entity {
  call_number: string;
  date_of_birth: string;
  email: string;
  first_name: string;
  is_blocked: boolean;
  last_name: string;
  login: string;
  middle_name: string;
  name: string;
  phone: string;
  virtual_number: string;
  role: Role;
  newPassword?: string;
  password?: string;
  city: City | null;
  region: Region | null;
  country: Country | null;
}

export interface Feature extends Entity {
  feature_id: string;
  model_feature_id: string;
  name: string;
  unit: string;
  value: string;
}

export interface RealEstateBuilding extends Entity {
  name: string;
  city: City | null;
  region: Region | null;
  country: Country | null;
  developer: Developer;
  latitude: number;
  longitude: number;
  location: string | null;
  site: string | null;
  paymentMethod_id?: string;
  presentation?: string;
  images: Blob[] | string[];
  payment_methods: PaymentMethod[];
  offers: any[];
  objects: any[];
  metro_stations: any[];
  tags: any[];
  duplicate: any;
  cities: any;
  developers: any;
  description: string;
  is_region: boolean;
  real_estate_building_id: string;
}

export interface CallInfo {
  call_source?: string;
  direction?: string;
  call_session_id: number;
  talk_time_duration: number;
  total_time_duration: number;
  wait_time_duration: number;
  tag_names: null | string[];
}

export interface ContactInfo {
  contact_phone_number: string;
  visitor_id: string;
  search_query: string;
  communication_number: string;
  visitor_is_new: boolean;
  search_engine: string;
}

export interface Event {
  key: string;
  value: string;
}

export interface UISType {
  communication_id: number;
  call_session_id: number;
  leg_id: number;
  employee_id: null | string;
  employee_info?: { employee_full_name: string; employee_id: number };
  channel: string;
  notification_name: string;
  event: Event;
  virtual_phone_number: string;
  notification_time: string;
  site_domain_name: string;
  advertising_campaign: string;
  contact_info: ContactInfo;
  call_info: CallInfo;
}

export interface ReportType {
  channel: string;
  date: string;
  link: string;
}
