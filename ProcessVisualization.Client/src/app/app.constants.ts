import { environment } from "src/environments/environment";

export class Constants {
  public static API_ENDPOINT = environment.api;
  public static BASE_URL= environment.api ;
  public static SHOW_LOADER = "show_loader";

  public static EV_LOGIN_STATE_CHANGED = "ev_login_state_changed";
  public static EV_SHOW_ALERT = "ev_show_alert";
  public static EV_SPINNER_STATE_CHANGED = "ev_spinner_state_changed"

}
