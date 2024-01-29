import { route } from "../router/simpleRouter";

export function GetQueryIdAndCategory() {
  if (route.query) {
    const id =
      "id" in route.query &&
      (typeof route.query.id == "number" || typeof route.query.id == "string")
        ? Number(route.query.id)
        : -1;
    const category =
      "category" in route.query &&
      (typeof route.query.category == "number" ||
        typeof route.query.category == "string" ||
        typeof route.query.category == "bigint")
        ? BigInt(route.query.category)
        : 0n;
    return { id, category };
  }
  return undefined;
}

export function GetCategory() {
  if (route.query) {
    const category =
      "category" in route.query &&
      (typeof route.query.category == "number" ||
        typeof route.query.category == "string" ||
        typeof route.query.category == "bigint")
        ? BigInt(route.query.category)
        : 0n;
    return { category };
  }
  return undefined;
}

export enum ItemPageMode {
  Standard = 0,
  Preview = 1, // Preview the item with inconsistent data
  Wait = 2, // Wait for the item to be created in RAM table
}

export function GetQueryMode() {
  if (
    route.query &&
    "mode" in route.query &&
    (route.query.mode === ItemPageMode.Preview ||
      route.query.mode === ItemPageMode.Wait)
  ) {
    return route.query.mode as ItemPageMode;
  }
  return ItemPageMode.Standard;
}

export function HasQueryRequest() {
  if (route.query && "request" in route.query)
    return route.query.request == true;
  return false;
}

export function HasQueryUserName() {
  if (route.query && "user" in route.query) return String(route.query.user);
  return false;
}
