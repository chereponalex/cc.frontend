import { ActionLink } from "@/components/shared";
import { EntityLinks } from "@/@types";
import { useStorage } from "@/utils/hooks/useStorage";
import cutString from "@/utils/cutString";
import { Tooltip } from "@/components/ui";
import { TextAlignEnum } from "@/utils/enums/TextAlignEnum";
import { useAppSelector } from "@/store";

const usePermissionLink = function (
  link: string,
  name: string,
  links: EntityLinks | null,
  maxLength: number,
  align: TextAlignEnum,
) {
  const permissions = useAppSelector(
    (state) =>
      state?.auth?.user?.role?.permissions as unknown as {
        [key: string]: boolean;
      },
  );

  const hasCurrentPermission = (key: string | undefined) => {
    if (!key) return false;
    return Boolean(permissions[key]);
  };

  if (!hasCurrentPermission(links?.view?.permission_key)) {
    return (
      <span className={"text-violet-600"}>{cutString(name, maxLength)}</span>
    );
  }
  if (
    Object.keys(permissions).map(function (key) {
      if (links) {
        // @ts-ignore
        if (links?.view?.permission_key === key && permissions[key]) {
          return true;
        }
      }

      return false;
    })
  ) {
    return (
      // @ts-ignore
      // <div style={{ textAlign: align.toString() }}>
      <ActionLink to={link} target="_blank">
        <Tooltip title={name}>
          {/* <span style={{ whiteSpace: "nowrap" }}> */}
          {cutString(name, maxLength)}
          {/* </span> */}
        </Tooltip>
      </ActionLink>
      // </div>
    );
  }

  return name;
};

export default usePermissionLink;
