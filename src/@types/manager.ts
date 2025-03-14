interface MapPoint {
  id: string;
  int_id: number;
  name: string;
  is_active: boolean;
  is_region: boolean;
  latitude: string;
  longitude: string;
  objects: Objects;
  payment_methods: PaymentMethod[];
  tags: Tag[];
  offers: Offers[];
  site: string;
  metro_stations: MetroStation[];
  location: string;
  description: string;
  deadline: number;
  operator_award?: number;
}
type Offers = {
  is_active: boolean;
  priority: number;
  uniqueness_period: number;
  operator_award: number;
  developer: { name: string };
  price: number;
};

type Objects = {
  count: number;
  ready_soon: number;
  ready: number;
  is_apartments: boolean;
  is_flats: boolean;
  deadline: number;
};

type FlatOrApartment = {
  id: string;
  int_id: number;
  price: string;
  square: number;
  real_estate_building?: { id: string };
  price_per_meter: string;
  finishing: { key: string; value: string };
  roominess: { key: string; value: string };
  type: { key: string; value: string } | [];
  deadline: { key: string; value: string };
  group?: string;
};

type MapProps = {
  sideBarsControl?: { [key: string]: boolean };
  setCurrentTab?: React.Dispatch<React.SetStateAction<string>>;
  currentTab?: string;
  loading: boolean;
  data: {
    city: any;
    data: MapPoint[];
    filters: any;
  };
  setPointSelected?: React.Dispatch<React.SetStateAction<MapPoint>>;
  phoneVal: string;
  setPhoneVal: React.Dispatch<React.SetStateAction<string>>;
  getMapObjects?: any;
  message?: string;
  setMessage?: React.Dispatch<React.SetStateAction<any>>;
};

type PaymentMethod = {
  [key: string]: string;
};

type MetroStation = {
  name: string;
  cities: any;
  metro_lines: any;
};

type Tag = {
  [key: string]: string;
};

interface UIS {
  id: string;
  name: string;
}
enum ActionMarker {
  SHOW = "show",
  HIDE = "hide",
}
