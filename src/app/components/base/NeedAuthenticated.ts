import { HttpErrorResponse } from "@angular/common/http";

export default class NeedAuthenticated {
  public sessionExpiredDialog = false;

  protected handlerSessionExpired(err: HttpErrorResponse): boolean {
    if (err.status === 401 && !this.sessionExpiredDialog) {
      this.sessionExpiredDialog = true;
    }

    return this.sessionExpiredDialog;
  }
}