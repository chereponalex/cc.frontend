export interface NavigationTree {
  key: string;
  path: string;
  isExternalLink?: boolean;
  title: string;
  translateKey: string;
  icon: string;
  type: "title" | "collapse" | "item";
  permissionKey?: string;
  create?: boolean;
  view?: boolean;
  authority: string[];
  subMenu: NavigationTree[];
  matchingKey: string;
}
