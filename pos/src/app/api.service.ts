import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConstants } from './app-constants';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { CommonService } from './common.service';
import { Router } from '@angular/router';


// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type': 'application/json',
//     'Authorization': localStorage.getItem('token')
//   })
// };

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': ''
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient,
    private common: CommonService,
    public router: Router) { }

  public getAPI(url: string): Observable<any> {
    //debugger;
    url = AppConstants.base_url + "/api/" + url;
    // console.log(url);
    httpOptions.headers = httpOptions.headers.set('Content-Type', 'application/json');
    httpOptions.headers = httpOptions.headers.set('Authorization', localStorage.getItem('token'));
    return this.http.get(url, httpOptions).pipe(
      retry(0),
      catchError(this.handleError.bind(this))
    );
  }

  public postAPI(url: string, data: any): Observable<any> {
    url = AppConstants.base_url + "/api/" + url;
    // headers.append('Content-Type', 'application/json');
    // headers.append('Accept', 'application/json');
    // headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
    // headers.append('Access-Control-Allow-Credentials', 'true');

    // headers.append('GET', 'POST', 'OPTIONS');
    // httpOptions.headers = httpOptions.headers.set('Content-Type', 'application/json');
    // httpOptions.headers = httpOptions.headers.set('Accept', 'application/json');
    httpOptions.headers = httpOptions.headers.set('Authorization', localStorage.getItem('token'));
    console.log(data);
    return this.http.post(url, data, httpOptions).pipe(
      catchError(this.handleError.bind(this))
      // catchError(error => {
      //   if (error.status === 401 || error.status === 403) {
      //     this.handleError.bind(this);
      //   }
      //   return throwError(error);
      // })
    );
  }

  public putAPI(url: string, data: any): Observable<any> {
    url = AppConstants.base_url + "/api/" + url;
    httpOptions.headers = httpOptions.headers.set('Authorization', localStorage.getItem('token'));
    console.log(data);
    return this.http.put(url, data, httpOptions).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public deleteAPI(url: string): Observable<any> {
    url = AppConstants.base_url + "/api/" + url;
    httpOptions.headers = httpOptions.headers.set('Authorization', localStorage.getItem('token'));
    return this.http.delete(url, httpOptions).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  handleError(error) {
    // setTimeout(() => {
    this.common.hideSpinner();
   console.log(error);
    let errorMessage = '';
    if (error.status != null && error.status == "401") {
      errorMessage = "Unauthorized";
    } else {
      if (error.error != null && error.error.message != null && error.error.message != "") {
        errorMessage = error.error.message;

      } else {
        if (error.error != null && error.error.error_description != null) {
          errorMessage = error.error.error_description;
        } else {
          if (error.error instanceof ErrorEvent) {
            errorMessage = 'Error: ${error.error.message}';
          } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
        }
      }

    }


    this.common.showMessage('error', errorMessage);
    if (errorMessage == "Unauthorized") {
      localStorage.setItem('isAuth', 'false');
      this.router.navigate(['login']);
    }
    return throwError(errorMessage);

    // }, this.common.time_out_delay);
  }
}
