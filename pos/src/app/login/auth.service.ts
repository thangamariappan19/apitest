import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app-constants';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    private common: CommonService) { }

  public login_me(username, password): Observable<any> {
    // this.common.showSpinner();
    var url = AppConstants.base_url + "/auth";
    var data = 'grant_type=password&username=' + username + '&password=' + password;
    return this.http.post<any>(url, data).pipe(
      retry(0),
      catchError(this.handleError.bind(this))
    );
  }

  handleError(error) {
    console.log(error);
    let errorMessage = '';
    if (error.error != null && error.error.error_description != null) {
      errorMessage = error.error.error_description;
    } else {
      if (error.error instanceof ErrorEvent) {
        errorMessage = 'Error: ${error.error.message}';
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    setTimeout(() => {
      this.common.hideSpinner();
      this.common.showMessage('error', errorMessage);
      return throwError(errorMessage);
    }, 2000);
  }
}
