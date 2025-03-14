const setMarkerActive = (
  isActive: boolean | string,
  id: string | null,
): void | null => {
  let element;
  if (id) {
    element = document.getElementById(`marker-${id}`);
    if (element) {
      return element.setAttribute("data-active", isActive.toString());
    }
  }
  return null;
};

export default setMarkerActive;
