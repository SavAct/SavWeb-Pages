import { route } from "../router/simpleRouter";

export function GetQueryId() {
  return route.query &&
    "id" in route.query &&
    (typeof route.query.id == "number" || typeof route.query.id == "string")
    ? Number(route.query.id)
    : -1;
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
