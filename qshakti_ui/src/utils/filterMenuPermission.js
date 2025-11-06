import { hasPermission } from "./permissions";

export function filterMenuByPermissions(menu) {
  return menu.map((group) => {
    const filteredItems = group.Items.filter((item) => {
      if (Array.isArray(item.key)) {
        // If multiple keys are provided, pass if ANY has 'view'
        return item.key.some((k) => hasPermission(k, "view"));
      } else {
        return hasPermission(item.key, "view");
      }
    });

    return {
      ...group,
      Items: filteredItems,
    };
  });
}
