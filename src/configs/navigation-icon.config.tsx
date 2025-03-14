import {
  HiOutlineColorSwatch,
  HiOutlineDesktopComputer,
  HiOutlineTemplate,
  HiOutlineViewGridAdd,
  HiOutlineHome,
} from "react-icons/hi";
import {
  CitySvg,
  DomainSvg,
  OffersSvg,
  SellSvg,
  SettingsSvg,
  SubwaySvg,
} from "@/assets/svg";
import { HiPhoneArrowUpRight } from "react-icons/hi2";

export type NavigationIcons = Record<string, JSX.Element>;

const navigationIcon: NavigationIcons = {
  home: <HiOutlineHome />,
  singleMenu: <HiOutlineViewGridAdd />,
  collapseMenu: <HiOutlineTemplate />,
  groupSingleMenu: <HiOutlineDesktopComputer />,
  groupCollapseMenu: <HiOutlineColorSwatch />,
  cityCollapseMenu: <CitySvg />,
  settingsCollapseMenu: <SettingsSvg />,
  sellCollapseMenu: <SellSvg />,
  domainCollapseMenu: <DomainSvg />,
  subwayCollapseMenu: <SubwaySvg />,
  offersCollapseMenu: <OffersSvg />,
  transferCollapseMenu: <HiPhoneArrowUpRight />,
};

export default navigationIcon;
