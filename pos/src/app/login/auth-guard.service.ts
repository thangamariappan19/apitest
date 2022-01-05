import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isatty } from 'tty';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public router: Router) { }

  canActivate(): boolean {
    let ret_val: boolean = false;
    const isAuth = localStorage.getItem('isAuth');
    const expr_time = localStorage.getItem('expr_time');
    if (expr_time != null) { // having expiry time
      let dat1: Date = new Date(expr_time);
      let dat2: Date = new Date();
      if (dat2 <= dat1) { // expiry time is greater than current time
        if (isAuth != null && isAuth == 'true') { // authenticated
          ret_val = true;
        }
      } 
    }

    if (ret_val == false) {
      localStorage.setItem('isAuth', 'false');
      this.router.navigate(['login']);
    }
    return ret_val;
  }
}
