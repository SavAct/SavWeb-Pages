import { route } from "../router/simpleRouter";

export function GetQueryId() {
  return route.query &&
    "id" in route.query &&
    (typeof route.query.id == "number" || typeof route.query.id == "string")
    ? Number(route.query.id)
    : -1;
}

export function HasQueryRequest() {
  if (route.query && "request" in route.query)
    return route.query.request == true;
  return false;
}
