import { Entity } from "@/@types";
import usePermissionLink from "@/utils/hooks/usePermissionLink";
import { TextAlignEnum } from "@/utils/enums/TextAlignEnum";

export const useCustomLink = function (
  prefix: string,
  entity: Entity | null,
  maxLength?: number | null,
  align?: TextAlignEnum | null,
) {
  if (!maxLength) {
    maxLength = 40;
  }

  if (!align) {
    align = TextAlignEnum.CENTER;
  }

  let customLink = null;

  if (entity && (entity.name || entity.text)) {
    let link = prefix + "/" + entity.id;
    let name = null;

    if (entity.full_name) {
      name = entity.full_name;
    }

    if (entity.name && (!entity.text || entity.text)) {
      name = entity.name;
    }

    if (entity.text && !entity.name) {
      name = entity.text;
    }

    if (name) {
      customLink = usePermissionLink(
        link,
        name,
        entity.links,
        maxLength,
        align,
      );
    }
  }

  return customLink;
};

export default useCustomLink;
