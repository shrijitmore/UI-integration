export function hasPermission(screens, action = "view") {
  const permissions = JSON.parse(sessionStorage.getItem("permissions") || "[]");

  if (typeof screens === "string") {
    screens = [screens];
  }

  return screens.some((screenName) => {
    const screen = permissions.find((p) => p.screen === screenName);
    return screen?.[action] === true;
  });
}
