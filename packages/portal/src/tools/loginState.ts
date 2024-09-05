import { Authorization } from "@ukdanceblue/common";

export interface PortalAuthData {
  authorization: Authorization | undefined;
  loggedIn: boolean | undefined;
}
