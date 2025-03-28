import * as Yup from "yup";
import { t } from "i18next";
export const validationSchemaResidentialComplex = Yup.object().shape({
  name: Yup.string().required(t("errorText.enterName")),
  city_id: Yup.string().required(t("errorText.checkCity")),
  developer_id: Yup.string().required(t("errorText.checkDeveloper")),
  is_region: Yup.boolean(),
  latitude: Yup.number()
    .required(t("errorText.enterLatitude"))
    .min(1, t("errorText.enterName")),
  longitude: Yup.number()
    .required(t("errorText.enterLongitude"))
    .min(1, t("errorText.enterName")),
  site: Yup.string().required(t("errorText.enterSite")),
  location: Yup.string().required(t("errorText.enterLocation")),
  description: Yup.string().required(t("errorText.enterDescription")),
});

export const validationSchemaCity = Yup.object().shape({
  name: Yup.string().required(t("errorText.enterName")),
  latitude: Yup.number()
    .required(t("errorText.enterLatitude"))
    .min(1, t("errorText.enterName")),
  longitude: Yup.number()
    .required(t("errorText.enterLongitude"))
    .min(1, t("errorText.enterName")),
  region_id: Yup.string().required(t("errorText.checkRegion")),
  country_id: Yup.string().required(t("errorText.checkCountry")),
  // location: Yup.string().required("Please enter your marital status"),
});
export const validationSchemaEmployee = Yup.object().shape({
  // staff_id: Yup.string().required(t("errorText.enterStaffId")),
  first_name: Yup.string().required(t("errorText.enterYourUserName")),
  phone: Yup.string().required(t("errorText.enterPhone")),
  last_name: Yup.string().required(t("errorText.enterYourLastName")),
  date_of_birth: Yup.string().required(t("errorText.enterDateBirth")),
  email: Yup.string().required(t("errorText.enterYourEmail")),
  password: Yup.string().required(t("errorText.enterYourPassword")),
  role_id: Yup.string().required(t("errorText.checkRole")),
  country_id: Yup.string().required(t("errorText.checkCountry")),
  region_id: Yup.string().required(t("errorText.checkRegion")),
  city_id: Yup.string().required(t("errorText.checkCity")),
  status_id: Yup.string().required(t("errorText.checkStatus")),
});

export const validationSchemaEmployeeEdit = Yup.object().shape({
  // staff_id: Yup.string().required(t("errorText.enterStaffId")),
  first_name: Yup.string().required(t("errorText.enterYourUserName")),
  phone: Yup.string().required(t("errorText.enterPhone")),
  last_name: Yup.string().required(t("errorText.enterYourLastName")),
  date_of_birth: Yup.string().required(t("errorText.enterDateBirth")),
  email: Yup.string().required(t("errorText.enterYourEmail")),
  password: Yup.string().required(t("errorText.enterYourPassword")),
  role_id: Yup.string().required(t("errorText.checkRole")),
  country_id: Yup.string().required(t("errorText.checkCountry")),
  region_id: Yup.string().required(t("errorText.checkRegion")),
  city_id: Yup.string().required(t("errorText.checkCity")),
});

export const validationSchemaSettings = Yup.object().shape({
  name: Yup.string().required(t("errorText.enterSettingsName")),
  key: Yup.string().required(t("errorText.enterKey")),
  value: Yup.string().required(t("errorText.enterValue")),
});

export const validationSchemaGroup = Yup.object().shape({
  name: Yup.string().required(t("errorText.enterName")),
});

export const validationSchemaCountry = Yup.object().shape({
  name: Yup.string().required(t("errorText.enterName")),
});

export const validationSchemaBindToBuilding = Yup.object().shape({
  name: Yup.string().required(t("errorText.enterName")),
});

export const validationSchemaObject = Yup.object().shape({
  real_estate_building_id: Yup.string().required(t("errorText.checkBuilding")),
  roominess: Yup.string().required(t("errorText.checkRoominess")),
  type: Yup.string().required(t("errorText.checkType")),
  finishing: Yup.string().required(t("errorText.checkFinish")),
  square: Yup.string().required(t("errorText.enterSquareMeters")),
  price: Yup.string().required(t("errorText.enterPrice")),
  deadline: Yup.string().required(t("errorText.enterDeadline")),
});

export const validationSchemaQuestion = Yup.object().shape({
  text: Yup.string().required(t("errorText.enterQuestion")),
  reply: Yup.string().required(t("errorText.enterAnswer")),
});

export const validationSchemaOffer = Yup.object().shape({
  name: Yup.string().required(t("errorText.enterName")),
  priority: Yup.string().required(t("errorText.enterPriority")),
  developer_id: Yup.string().required(t("errorText.checkDeveloper")),
  marketplace_id: Yup.string().required(t("errorText.enterName")),
  scripts: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string(),
        value: Yup.string(),
      }),
    )
    .min(1, t("errorText.checkScript")),
  city_id: Yup.string().required(t("errorText.checkCity")),
  real_estate_building_id: Yup.string().required(t("errorText.checkBuilding")),
  sip_uri: Yup.string().required(t("errorText.enterSipUri")),
  limit: Yup.string().required(t("errorText.enterLimitCall")),
  uniqueness_period: Yup.string().required(t("errorText.enterUniqPeriod")),
  price: Yup.string().required(t("errorText.enterPrice")),
  operator_award: Yup.string().required(t("errorText.enterOperatorAward")),
});

export const validationSchemaRegion = Yup.object().shape({
  name: Yup.string().required(t("errorText.enterName")),
  country_id: Yup.string().required(t("errorText.checkCountry")),
});

export const validationSchemaDeveloper = Yup.object().shape({
  name: Yup.string().required(t("errorText.enterName")),
});

export const validationSchemaTag = Yup.object().shape({
  name: Yup.string().required(t("errorText.enterName")),
});

export const validationSchemaVenue = Yup.object().shape({
  name: Yup.string().required(t("errorText.enterName")),
});

export const validationSchemaStation = Yup.object().shape({
  name: Yup.string().required(t("errorText.enterName")),
  city_id: Yup.string().required(t("errorText.checkCity")),
  metro_line_id: Yup.string().required(t("errorText.checkMetroLine")),
});

export const validationSchemaLine = Yup.object().shape({
  name: Yup.string().required(t("errorText.enterName")),
  city_id: Yup.string().required(t("errorText.checkCity")),
  color: Yup.string().required(t("errorText.checkColor")),
  line_type: Yup.string().required(t("errorText.checkLineType")),
});

export const validationSchemaWorkingHour = Yup.object().shape({
  offer_id: Yup.string().required(t("errorText.enterName")),
  // days_id: Yup.string().required(t("errorText.checkDay")),
});

export const validationSchemaScript = () => {
  return Yup.object().shape({
    name: Yup.string().required(t("errorText.enterName")),
    script_location: Yup.string().required(t("errorText.checkScript_location")),
    // type: Yup.string().required(t("errorText.checkScript_type")),
  });
};

export const validationSchemaBlackList = Yup.object().shape({
  phoneNumber: Yup.string().required(t("errorText.enterPhone")),
  // dialCode: Yup.string().required(t("errorText.enterDialCode")),
});

export const validationSchemaProfile = Yup.object().shape({
  first_name: Yup.string().required(t("errorText.enterYourUserName")),
  last_name: Yup.string().required(t("errorText.enterYourUserLastName")),
  email: Yup.string().required(t("errorText.enterYourEmail")),
});

export const validationSchemaRole = Yup.object().shape({
  name: Yup.string().required(t("errorText.enterYourUserName")),
  // permissions: Yup.string().required(t("errorText.enterPermissions"))
});

export const validationSchemaChangePass = Yup.object().shape({
  newPassword: Yup.string()
    .required(t("errorText.enterYourNewPassword"))
    .oneOf([Yup.ref("repeatNewPassword")], t("errorText.passwordsDoNotMatch")),
  repeatNewPassword: Yup.string()
    .required(t("errorText.enterYourNewPassword"))
    .oneOf([Yup.ref("newPassword")], t("errorText.passwordsDoNotMatch")),
});

// export const createValidationSchemaOffer = (isSipUriRequired: boolean) => {
//   console.log(isSipUriRequired, "isSipUriRequired");
//   return Yup.object().shape({
//     name: Yup.string().required(t("errorText.enterName")),
//     priority: Yup.string().required(t("errorText.enterPriority")),
//     developer_id: Yup.string().required(t("errorText.checkDeveloper")),
//     marketplace_id: Yup.string().required(t("errorText.enterName")),
//     scripts: Yup.array()
//       .of(
//         Yup.object().shape({
//           label: Yup.string(),
//           value: Yup.string(),
//         })
//       )
//       .min(1, t("errorText.checkScript")),
//     city_id: Yup.string().required(t("errorText.checkCity")),
//     real_estate_building_id: Yup.string().required(
//       t("errorText.checkBuilding")
//     ),
//     sip_uri: !isSipUriRequired
//       ? Yup.string().required(t("errorText.enterSipUri"))
//       : Yup.string().nullable(),
//     // sip_uri: Yup.string().required(t("errorText.enterSipUri")),
//     limit: Yup.string().required(t("errorText.enterLimitCall")),
//     uniqueness_period: Yup.string().required(t("errorText.enterUniqPeriod")),
//     price: Yup.string().required(t("errorText.enterPrice")),
//     operator_award: Yup.string().required(t("errorText.enterOperatorAward")),
//   });
// };
