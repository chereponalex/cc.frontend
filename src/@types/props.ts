import {
  FormEssenceCountry,
  FormEssenceLineMeter,
  FormEssenceMetroStation,
  FormEssenceOffer,
} from "@/@types/form";
import { Country, MetroLine, MetroStation, Role } from "@/@types/index";

export type CreatNewFormProps<T> = {
  data?: T;
  isEdit?: boolean;
  onNextChange?: (values: T) => void;
  isLoadingEndpoint?: boolean;
  offer_id?: string;
  duplicate?: string | null;
};

export interface CreatNewFormLineMeterProps {
  data?: MetroLine;
  isEdit?: boolean;
  onNextChange?: (values: FormEssenceLineMeter) => void;
  isLoadingEndpoint?: boolean;
  duplicate?: string | null;
}

export interface CreatNewFormMetroStationProps {
  data?: MetroStation;
  isEdit?: boolean;
  onNextChange?: (values: FormEssenceMetroStation) => void;
  isLoadingEndpoint?: boolean;
  duplicate?: any;
}

export interface CreatNewFormCountryProps {
  data?: Country;
  isEdit?: boolean;
  onNextChange?: (values: FormEssenceCountry) => void;
  isLoadingEndpoint?: boolean;
}

export interface CreatNewFormObjectProps {
  data?: Country;
  isEdit?: boolean;
  onNextChange?: (values: FormEssenceCountry) => void;
  isLoadingEndpoint?: boolean;
  duplicate?: string | null;
  dataObject?: any;
  object_id?: string | null;
}

export interface CreatNewFormQuestionProps {
  data?: any;
  isEdit?: boolean;
  onNextChange?: (values: FormEssenceCountry) => void;
  isLoadingEndpoint?: boolean;
  duplicate?: any;
}

export interface CreatNewFormOfferProps {
  data?: any;
  isEdit?: boolean;
  onNextChange?: (values: FormEssenceOffer) => void;
  isLoadingEndpoint?: boolean;
  duplicate?: any;
  object_id?: string | null;
}
export interface CreatNewFormRoleProps {
  data?: Role;
  isEdit?: boolean;
  onNextChange?: (values: FormEssenceCountry) => void;
  isLoadingEndpoint?: boolean;
  isEditPage?: any;
  duplicate?: any;
}
