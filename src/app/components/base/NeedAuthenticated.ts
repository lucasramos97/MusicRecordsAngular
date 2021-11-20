import { HttpErrorResponse } from '@angular/common/http';

export default class NeedAuthenticated {
  public visibleSessionExpired = false;

  protected handlerSessionExpired(err: HttpErrorResponse): boolean {
    if (err.status === 401 && !this.visibleSessionExpired) {
      this.visibleSessionExpired = true;
    }

    return this.visibleSessionExpired;
  }
}
