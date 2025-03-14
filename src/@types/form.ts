// export type FormEssence<T> = Omit<T, "id" | "links">;
export type FormEssence<T> = Omit<T, "id" | "links"> & { [key: string]: any };

export interface FormEssenceLineMeter {
  name: string;
  city_id: string;
  color?: any;
  line_type?: string;
}

export interface FormEssenceMetroStation {
  name: string;
  city_id: string;
  metro_line_id?: string;
}

export interface FormEssenceDeveloper {
  name: string;
}

export interface FormEssenceCountry {
  name: string;
}

export interface FormEssenceOffer {
  name: string;
}

export interface FormEssenceRegion {
  name: string;
  country_id: { name: string };
}

export interface FormEssenceBlackList {
  dialCode: string;
  phoneNumber: string;
}

export interface FormEssenceSetting {
  name: string;
  key: string;
  value: string;
}
