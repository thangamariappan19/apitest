import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConstants } from './app-constants';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { CommonService } from './common.service';
import { Router } from '@angular/router';
const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "text/xml",
    "Accept": "text/xml"
  })
};

// const httpOptions = {
//   headers: new HttpHeaders({
//       'Content-Type': 'text/xml',
//       'Accept': '*/*',
// 'Access-Control-Allow-Origin':'*'
//   })
// };

@Injectable({
  providedIn: 'root'
})
export class SoapService {

  constructor(private http: HttpClient,
    private common: CommonService,
    public router: Router) { }

  public getSOAPAPI(url: string): Observable<any> {
    debugger;
    url = AppConstants.base_url + "/api/" + url;
    // console.log(url);
    httpOptions.headers = httpOptions.headers.set('Content-Type', 'application/json');
    httpOptions.headers = httpOptions.headers.set('Authorization', localStorage.getItem('token'));
    return this.http.get(url, httpOptions).pipe(
      retry(0),
      catchError(this.handleError.bind(this))
    );
  }

  public checkItemStock(itemCode: string, locationCode: string): Observable<any> {
    debugger;
    const data = '<?xml version="1.0" encoding="utf-8"?> ' +
      ' <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> ' +
      ' <soap:Body> ' +
      ' <CHECK_ITEMSTOCK xmlns="http://tempuri.org/"> ' +
      ' <Input> ' +
      ' <USER_NAME>' + AppConstants.soap_un + '</USER_NAME> ' +
      ' <PASSWORD>' + AppConstants.soap_pwd + '</PASSWORD> ' +
      ' <Itemcode>' + itemCode + '</Itemcode> ' +
      ' <LOCATION_CODE>' + locationCode + '</LOCATION_CODE> ' +
      ' </Input> ' +
      ' </CHECK_ITEMSTOCK> ' +
      ' </soap:Body> ' +
      ' </soap:Envelope> ';
    return this.http.post(AppConstants.soap_check_item_stock, data
      , {
        headers: {
          "Content-Type": "text/xml",
          "Accept": "text/xml"
        }
        , responseType: 'text'
      })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  public putSOAPAPI(url: string, data: any): Observable<any> {
    url = AppConstants.base_url + "/api/" + url;
    httpOptions.headers = httpOptions.headers.set('Authorization', localStorage.getItem('token'));
    console.log(data);
    return this.http.put(url, data, httpOptions).pipe(
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
