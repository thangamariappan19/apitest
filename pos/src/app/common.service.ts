import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  time_out_delay: number;
  max_rows_per_page: number;
  max_pagination_size: number;
  crypto_string: string;
  constructor(private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
      this.time_out_delay = 1000;
      this.max_rows_per_page = 10;
      this.max_pagination_size = 20;
      this.crypto_string = "a$ten*$@#!^@2020";
     //this.crypto_string = "@$10-@RM@D@-0210";
    //this.crypto_string = "MAKV2SPBNI99212";
  }

  // Toast Message
  showMessage(type: string, msg: string) {
    let dur = 2000;
    if (type.toLowerCase() == 'success') {
      this.toastr.success(msg, 'POS', {
        closeButton: true,
        timeOut: dur,
        progressBar: true,
        progressAnimation: 'increasing'
      });
    } else if (type.toLowerCase() == 'error') {
      this.toastr.error(msg, 'POS', {
        closeButton: true,
        timeOut: dur,
        progressBar: true,
        progressAnimation: 'increasing'
      });
    } else if (type.toLowerCase() == 'warn') {
      this.toastr.warning(msg, 'POS', {
        closeButton: true,
        timeOut: dur,
        progressBar: true,
        progressAnimation: 'increasing'
      });
    } else {
      this.toastr.info(msg, 'POS', {
        closeButton: true,
        timeOut: dur,
        progressBar: true,
        progressAnimation: 'increasing'
      });
    }
  }

  // Spinner
  showSpinner(){
    this.spinner.show();
  }

  hideSpinner(){
    this.spinner.hide();
    // setTimeout(() => {
    //   this.spinner.hide();
    // }, 1000);
  }

  currentDate() {
    const currentDate = new Date();
    return currentDate.toISOString().substring(0,10);
  }

  toYMDFormat(dat:Date){
    
    var d = new Date(dat),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  toDMYFormat(dat:Date){
    
    var d = new Date(dat),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('-');
  }
  
  toMYFormat(dat:Date){
    //var months    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var d = new Date(dat),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month].join('-');
  }

  toddmmmyyFormat(dat:Date){
    {     
        var myDate = new Date(dat);
        var month = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][myDate.getMonth()];
        var str = myDate.getDate() + "-" + month + "-" + myDate.getFullYear().toString().substr(-2);
        return str;      
  }
}

tohhmmaFormat(dat:Date){ 

            var myDate = new Date(dat);
            var hours = myDate.getHours();
            var minutes = myDate.getMinutes();

            var suffix = "AM";
            if (hours >= 12) {
                suffix = "PM";
                hours = hours - 12;
            }
            if (hours == 0) {
                hours = 12;
            }
            if (minutes < 10)
            return hours + ":" + "0" + minutes + " " + suffix;
            else
            return hours + ":" + minutes + " " + suffix; 
}
  encrypt(value) {
    // var encrypted = CryptoJS.AES.encrypt(value, this.crypto_string);

    var key = CryptoJS.enc.Utf8.parse(this.crypto_string);
    var iv = CryptoJS.enc.Utf8.parse(this.crypto_string);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
  }

  decrypt(value) {
    // var decrypted = CryptoJS.AES.decrypt(value, this.crypto_string);

    var key = CryptoJS.enc.Utf8.parse(this.crypto_string);
    var iv = CryptoJS.enc.Utf8.parse(this.crypto_string);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
    
  }
}
