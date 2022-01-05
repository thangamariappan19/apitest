import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

import * as KJUR from 'jsrsasign';
import { HttpClient } from '@angular/common/http';
import { find } from 'rxjs/operators';

// import * as shajs from 'sha.js';
// import * as qz from 'qz-tray';

declare var qz: any;

@Injectable()
export class QzTrayService {
	private config;

	constructor(private http: HttpClient) {}

	async getPrivateKey() {
		return this.http.get("/certificates/cert.txt", { responseType: 'text' }).toPromise();
	}

	async getPrivatePem() {
		return this.http.get("/certificates/key.txt", { responseType: 'text' }).toPromise();
	}
	
	// example cert
	// initQZ () {
	// 	debugger;
	// 	let privateKey = '-----BEGIN CERTIFICATE-----' +
	// 	'MIIEFjCCAv6gAwIBAgIJAIkurKo4LUK9MA0GCSqGSIb3DQEBCwUAMIGeMQswCQYD' +
	// 	'VQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5j' +
	// 	'aXNjbzERMA8GA1UECgwIY29td29ya3MxCzAJBgNVBAsMAklUMR4wHAYDVQQDDBVo' +
	// 	'dHRwOi8vbG9jYWxob3N0OjQyMDAxIjAgBgkqhkiG9w0BCQEWE2VyeHJpbG93bEBn' +
	// 	'bWFpbC5jb20wIBcNMTgwNzI0MDMwMDQyWhgPMjA1MDAxMTYwMzAwNDJaMIGeMQsw' +
	// 	'CQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZy' +
	// 	'YW5jaXNjbzERMA8GA1UECgwIY29td29ya3MxCzAJBgNVBAsMAklUMR4wHAYDVQQD' +
	// 	'DBVodHRwOi8vbG9jYWxob3N0OjQyMDAxIjAgBgkqhkiG9w0BCQEWE2VyeHJpbG93' +
	// 	'bEBnbWFpbC5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDqgGJc' +
	// 	'6rK9bASID7Bs8M5r/5yQbae8OiVdSXv3KG9xVTRIcry4O8+PmP3j9SlMiSqHuOU6' +
	// 	'VSW3gHZ0Tfh4onERdRBtxEvazn0rN47CLjSI/zOkAZoybveoo7u5LABwPL+NIRWm' +
	// 	'nSdDhq53V1IEK3rxmI0MMv7SiuH4dbC2cfH032ufgNCI7AnJaFjkxcn0qe5YwPu7' +
	// 	'VW+ZoUO1IsSvKH9MKmVeKK/OdkKLIGke6+G8BDPtAtxVJoAJ8vOPxxBEI4hS5Jc2' +
	// 	'PaRfmVkRuy0mfdaJKZD07hvvn+6+LRXY4Ynh1O18GTyZT/fXs4dqcapHpVTQy/K0' +
	// 	'SP53MIhDbt1qGlldAgMBAAGjUzBRMB0GA1UdDgQWBBSrDNQ4Glj8m44LwrM54GNH' +
	// 	'gDTwQzAfBgNVHSMEGDAWgBSrDNQ4Glj8m44LwrM54GNHgDTwQzAPBgNVHRMBAf8E' +
	// 	'BTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQB67KHLWDoPJVsGh/SoQ70MbELoynoJ' +
	// 	'3+NqrEyGcqTkCMjE5LQQKFfH0oN4Ncaq0jQDVnYaSM5NWUOCQ1tYOdoFNMv52I/H' +
	// 	'5r451ipZz+GO4uIGElkG5BuOt3GQ/vGQg/RzP+gyTMgXebMjt0n7FZRyNZhrThU0' +
	// 	'z5fPvS+ugIpKik/kgkVhUTLN+yhoPBdNXbBNBrvwVShNUxoK+LNjaEqw5i7uriNU' +
	// 	'1DyzTSgMOgN3pIRYjZma0eYdpmIyQK2rgvzjZr74YYBarFXi/5j3C8Wxot2Tzqg7' +
	// 	'fpKw0F7doUdXkeL8YoBnuNieCLYpy1g70byfbHmmkvaTuFQf3ARQp2Tt' +
	// 	'-----END CERTIFICATE-----';
	// 	let privatePem = '-----BEGIN PRIVATE KEY-----' +
	// 	'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDqgGJc6rK9bASI' +
	// 	'D7Bs8M5r/5yQbae8OiVdSXv3KG9xVTRIcry4O8+PmP3j9SlMiSqHuOU6VSW3gHZ0' +
	// 	'Tfh4onERdRBtxEvazn0rN47CLjSI/zOkAZoybveoo7u5LABwPL+NIRWmnSdDhq53' +
	// 	'V1IEK3rxmI0MMv7SiuH4dbC2cfH032ufgNCI7AnJaFjkxcn0qe5YwPu7VW+ZoUO1' +
	// 	'IsSvKH9MKmVeKK/OdkKLIGke6+G8BDPtAtxVJoAJ8vOPxxBEI4hS5Jc2PaRfmVkR' +
	// 	'uy0mfdaJKZD07hvvn+6+LRXY4Ynh1O18GTyZT/fXs4dqcapHpVTQy/K0SP53MIhD' +
	// 	'bt1qGlldAgMBAAECggEBAIBDNInp/VXKLThWjIMpu14q83Gz6Jj1nNZHiTyIq1vr' +
	// 	'5KrzxvFmFYNPhR8YSzyHkfGmWgrr47NY2nGG7C7fesS3qQLA6VSGuMPYoYboSufb' +
	// 	'3l0IW1TWiTN+SwFfZeX99C+3NuZo8r7mfarc4glR1u8qJ4vSoLp8KFkD1mIUNOlf' +
	// 	'9qxmKNphOqJJ1W+aPVyQbFziu8id3O3M6onATaM9SDgbbEPwh7MP9No1bXuoCs7C' +
	// 	'+A+Dw7TUurkKDbnwRbu2cebfD93in64ofjfsETLo3bxNDtgeXKnDyubb2RqieUcJ' +
	// 	'uK88gYAisit0qXRS7ICo1W7cv0xLn918n5ro98GtNoECgYEA95Erkyk2HQdrEa8y' +
	// 	'wrOIj0Qdt4ZLyE7xeP5m1/UhNYk87Y9ssfHDj7UaluY+Hqj+Ek/vI+fUaK9p7uEb' +
	// 	'1UEuhrb9vw/S6rYEZ5m00U4vZD6NogY4F0AIMAlFtWJPeyUBtGbYypHJKsEzgZl4' +
	// 	'BqdslzYPAnsB9Xh67zC3+AzA3VECgYEA8n1HpblWgUd6W/PjPJF9aBHb5SCzZlVm' +
	// 	'eR9pGZ9XNQprDwBHCtk6ymqnKvS421moFYMcd6Xdf+jDVOXCeMl6zQl2VE7oF9Oo' +
	// 	'xAt/hCVADvxGEW689FSiH8km92fnkowu6NxslwTEuz83RXEEX9Nund57iK0uGGYT' +
	// 	'BHG1by4JSE0CgYAr5gUJCkS7LwaQUzW4CqfLZ7OxSFIFyeHNp6bK4n+qA5TXNxh6' +
	// 	'ETmxMNbvLRKU0ziCPMRV5JTonzo0jpwl23IJl0c1avPmhLIRQNMsTiXfK6xnr5yg' +
	// 	'ms0Y33wJ5s3bMzuzJo2IlgNK3olokLMU0vlRcteEhBVb1qpN4aCtjm1gkQKBgDqf' +
	// 	'lwa1u/gdM7OvTqyB7/OM/cBzG2wOEWwO7/XF0+t6zU8fHg29Xr0485kq+NXu4vfw' +
	// 	'bp1ueBJIT5DiyxUwgIO5WeYf/XRlM1PSA84Kw2XcD4R/ZSccnuVYWBdQA2gmg+DA' +
	// 	'CXCpMnaiXdZn8ErKbt+zveHZHF/Bra9RXi+2zX+xAoGAY7kx7FnE3o9PtbmldB+x' +
	// 	'J+DrEPHI8TUtlCmLurMgSNttel0e2ky7Rc0gCguYT6yT1R0bqRYy1epHEup/Wr0F' +
	// 	'VnJtUf5UWQHtVhWKTrEfW4G3JuwkAURkTHYrsGnjrBZQCzVnRmFv/CA4tplfo5Jk' +
	// 	'eZeUeeDzMys5OVxIaka+p+M=' +
	// 	'-----END PRIVATE KEY-----';

	// 	// this.getPrivateKey().then((data) => privateKey = data);
	// 	// this.getPrivatePem().then((data) => privatePem = data);
		
	// 	qz.security.setCertificatePromise(function(resolve, reject) {
	// 		console.log('Set Certificate');
	// 		resolve(privateKey);
	// 	});
	
	// 	qz.security.setSignaturePromise(function(toSign) {
	// 		return function(resolve, reject) {
	// 			try {
	// 				var pk = KJUR.KEYUTIL.getKey(privatePem);
	// 				var sig = new KJUR.crypto.Signature({"alg": "SHA1withRSA"});
	// 				sig.init(pk); 
	// 				sig.updateString(toSign);
	// 				var hex = sig.sign();
	// 				resolve(KJUR.stob64(KJUR.hextorstr(hex)));
	// 			} catch (err) {
	// 				console.error(err);
	// 				reject(err);
	// 			}
	// 		};
	// 	});

	// 	// qz.websocket.connect();
	// }

	// localhost cert

	// initQZ () {
	// 	debugger;
	// 	let privateKey = '-----BEGIN CERTIFICATE-----' +
	// 	'MIIC7DCCAdSgAwIBAgIQEWOsacqCEb1DVyH/9FmiRjANBgkqhkiG9w0BAQsFADAU' +
	// 	'MRIwEAYDVQQDEwlsb2NhbGhvc3QwHhcNMTkwODIzMDc0MTQwWhcNMjQwODIzMDAw' +
	// 	'MDAwWjAUMRIwEAYDVQQDEwlsb2NhbGhvc3QwggEiMA0GCSqGSIb3DQEBAQUAA4IB' +
	// 	'DwAwggEKAoIBAQDKbv7xNnuObnk8FA5RlyCPpXmxmzisQJS6LBsHKn80nZqovoq5' +
	// 	'bE2CZhpKjaJ4zUhms6Ffxw6xJk9BkqxG1Cdy2P459k/TKyIfyuEooFlRkIQ25yAn' +
	// 	'5BDaXKaHGntT8P5cIHbvzN841a+aFbgFlXwP7wAh8TYKJlwISVV1GRKfjgceXjqe' +
	// 	'iIWHfvaggb8yfApUziNFo+u/XEEgy6WODkWM0S8HKTg0nvXE1mK7iuplkQBaD/fa' +
	// 	'PEe+IUvDyPYjUeqUskoddIgViOCaPBpc8plWE7ibbwIn1X9WIvZIYjxp1NwVrpW7' +
	// 	'ysvlaIzUA4mA6pyeb6jcDekzA0IBOmpyMa/RAgMBAAGjOjA4MAsGA1UdDwQEAwIE' +
	// 	'sDATBgNVHSUEDDAKBggrBgEFBQcDATAUBgNVHREEDTALgglsb2NhbGhvc3QwDQYJ' +
	// 	'KoZIhvcNAQELBQADggEBAI00EnjooDvc9oWg1+fj/LaRSX81Uibk60yd2z1c0aSL' +
	// 	'rgOjLUbVrjeZxvH1+lzLGVhOTVWfMreP1IBWoITrSWwPEDcV+4Lge/Z5Su0FGenq' +
	// 	'QkaV6GRJKM8KrEzeJgBcH3ukZ5ShpgTe4Fw5D+aR+DdJeOUWePGwsKHm6ylZcSLx' +
	// 	'3HqkH16Sy67loLHkPRLgd5TZ8eycKNSK3YDrAT1P6gYY11STtndXBmRKU9iolSKb' +
	// 	'XuwjpLM1UyXuLU90pJq9urKtlLbKQ5txVjqWNCBeJ07q3q0S59gyyaaIHOEcGL3E' +
	// 	'FJgheKCjRX5khNPqG+8hRO6bAPeiQauDQtKPiwU8hNg=' +
	// 	'-----END CERTIFICATE-----';
	// 	let privatePem = '-----BEGIN PRIVATE KEY-----' +
	// 	'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDKbv7xNnuObnk8' +
	// 	'FA5RlyCPpXmxmzisQJS6LBsHKn80nZqovoq5bE2CZhpKjaJ4zUhms6Ffxw6xJk9B' +
	// 	'kqxG1Cdy2P459k/TKyIfyuEooFlRkIQ25yAn5BDaXKaHGntT8P5cIHbvzN841a+a' +
	// 	'FbgFlXwP7wAh8TYKJlwISVV1GRKfjgceXjqeiIWHfvaggb8yfApUziNFo+u/XEEg' +
	// 	'y6WODkWM0S8HKTg0nvXE1mK7iuplkQBaD/faPEe+IUvDyPYjUeqUskoddIgViOCa' +
	// 	'PBpc8plWE7ibbwIn1X9WIvZIYjxp1NwVrpW7ysvlaIzUA4mA6pyeb6jcDekzA0IB' +
	// 	'OmpyMa/RAgMBAAECggEAT3UZ5Jw6C0IZnBdTN3tWcIvHJIuExzfiKOE/CqUHoSNr' +
	// 	'nWiNExMLqW9iSnklmL0a+hTv9qQvhCFBYr+rl3GWumGqCB5CXuTDVC9SCZxG8tkC' +
	// 	'zHoUCRRf+RX813LxjZU+gfLMPHvx8mENuDFmNeri824gYzJGv90mqqn+PSRGRxHI' +
	// 	'/hq3sgCPortD6ArwulNKEsjNFp9GUOwvJZavpQm4hsyMNoSGMy5ZMNhnJN2L0YUw' +
	// 	'SYrpvD0+ENgYfUJbTnHfCSmWv4Nz+Fq+2Wws7B0mU9q+1LWQa6IZuUXDj7COMKqE' +
	// 	'BoAJ2vtbJ7nlziF7mFgTjKJviUtHvX/YVwnQ0u05MQKBgQDPELrEj7Ok5OTKc24u' +
	// 	'NoCNxvfXu8fZXjh3W8DAYhtSV0jPyGSD2ZYkgeEALgEafu9e7JBEY141sim1lpnz' +
	// 	'o/QgGmp6nr6llvVfB46Is/GG19op3sOnuzfYSxDgzL3LW1JswAgtUwUYZlLqt0c5' +
	// 	'P9Zoyibm7RPPhQ5+25ABPfpWYwKBgQD6RgxVzpSIY8H0GDqcCcFnZVMXhCnisEBo' +
	// 	'qY6vPFYDuVLXWk6/qe1EZFdFXJGRVVM7dFBWcYDwRP1ECnGFnUomuHP/VQzeWz19' +
	// 	'oWBmOkegRrkStAb6Zb5wrEFJdOntH56ci6DAbsVmt64KKv5gUXFkYw2F08zoq0sL' +
	// 	'xDxs0axNOwKBgDWpSD2YYB3jk8dDktI3HamgXqpx56DVYhzMkm9I/XuhUyVF8YaZ' +
	// 	'5OchIYZCZdbP/ojDFcAjYE7aFSUSGmOhoaqQLfgJG68eKAiwlKeouncPiWJAcMQP' +
	// 	'KLHNAlq/tI/24q18NqJIWZGxMtvRE4wqlw4hFWPTHMcy3EbT78XiofWxAoGACfSl' +
	// 	'YvhvwiktuvcHxdNBhUprjsDsJZ9bQI6WJXRh+43wtK5b+ZXZ4WGYcyLmi4B4aiIL' +
	// 	'XBTxyx0DciR0NZt3KqklvB92/pVkkc3MluR0mvSVQiA1Mtq/Q54mjrR+5bbfSVzo' +
	// 	'jR8a7SYbXz4slkpHF3Y1QICXYx4FQzeQK8f/cacCgYEAh18A9ENypVE0K9XxtGpF' +
	// 	'ssg/MrYaNQAF3yPvwn2Em1/L1/D0Xu65uo+uOtlkPGGD9xzwseqJcgwruYtX3LFM' +
	// 	'AzrGUujAwTvMN/S3OtVC2VbRrvgPBlhNThnJDHiM/qecpGj3O7JqeceWw7BTyxWq' +
	// 	'mn46jPUaffbuc18BKyNwee0=' +
	// 	'-----END PRIVATE KEY-----';

	// 	// this.getPrivateKey().then((data) => privateKey = data);
	// 	// this.getPrivatePem().then((data) => privatePem = data);
		
	// 	qz.security.setCertificatePromise(function(resolve, reject) {
	// 		console.log('Set Certificate');
	// 		resolve(privateKey);
	// 	});
	
	// 	qz.security.setSignaturePromise(function(toSign) {
	// 		return function(resolve, reject) {
	// 			try {
	// 				var pk = KJUR.KEYUTIL.getKey(privatePem);
	// 				var sig = new KJUR.crypto.Signature({"alg": "SHA1withRSA"});
	// 				sig.init(pk); 
	// 				sig.updateString(toSign);
	// 				var hex = sig.sign();
	// 				resolve(KJUR.stob64(KJUR.hextorstr(hex)));
	// 			} catch (err) {
	// 				console.error(err);
	// 				reject(err);
	// 			}
	// 		};
	// 	});

	// 	// qz.websocket.connect();
	// }

	// IIS Cert
	// initQZ () {
	// 	debugger;
	// 	let privateKey = '-----BEGIN CERTIFICATE-----\n' +
	// 	'MIIC/jCCAeagAwIBAgIQVqrhFRLTwJZL9F9L9FwmzjANBgkqhkiG9w0BAQsFADAa\n' +
	// 	'MRgwFgYDVQQDEw9ERVNLVE9QLUM2QTM5TUEwHhcNMjAxMjA1MDg1NDUzWhcNMjEx\n' +
	// 	'MjA1MDAwMDAwWjAaMRgwFgYDVQQDEw9ERVNLVE9QLUM2QTM5TUEwggEiMA0GCSqG\n' +
	// 	'SIb3DQEBAQUAA4IBDwAwggEKAoIBAQDOKJBVNAYgtJVTi1XfRoLW/xwiM0TgEEM0\n' +
	// 	'GYHJm6Xr5PSXvgLWuyF1GjsRzdqq1tFu1UsDeZZ2oJwJYi6hzOfaRfc93fCXYJVW\n' +
	// 	'N1PM/FU19QFIT3IAOOv9eaM1ygkVCyQX+WrvdtO/UW98boFV/+mRdC3ffzzUUau3\n' +
	// 	'wCpbXk42gO5jhrAcwBQlRk6XP9F3+qJPJiM8+TdSCakektfwpCOMBvylEZIVbBcB\n' +
	// 	'cfHcaL5iZeJwVTElxvIkBRjo/QIeRUdfYEL18Ti/7TCx09aZnqtDRM3kDWOU5NUn\n' +
	// 	'gOjOkLr48ZRjcBlYOtJENiEVrnZtkOZMj6I03Xyj3knPX1AxqfLJAgMBAAGjQDA+\n' +
	// 	'MAsGA1UdDwQEAwIEMDATBgNVHSUEDDAKBggrBgEFBQcDATAaBgNVHREEEzARgg9E\n' +
	// 	'RVNLVE9QLUM2QTM5TUEwDQYJKoZIhvcNAQELBQADggEBAC7yWd0e20RoZ3RQFxTb\n' +
	// 	'D6IJySu/3MuXwgHK8QsRWCI6QZZsbCUORtFJBiIZNAJ2AmiugKQ95m5G+JipXVkm\n' +
	// 	'iWJWkhtFkB6SaVTMIKCgk6Q62erxBOLpYLWaHfXfUDBuBNLwk9pwEfK5r4i8PMiB\n' +
	// 	'F/TzKyebDSJ5NhPKdCZDvOLxhsz9dQ6R13ZlHjTrN3IyskldVHz9AoXD9Z2GUTAH\n' +
	// 	'GLVRpW/1/Vogcoqd2T4DP5suYS/VeR0S9cXk+cV4KNo7quNNIk6PtC2sgKYXw+sZ\n' +
	// 	'6oq6cK5HLebsq6rQTKDPBQy1BP6M2wLH3gdqGGuL28I1COD+O8C98VOvSrg32Dx+\n' +
	// 	'14U=\n' +
	// 	'-----END CERTIFICATE-----\n';
	// 	let privatePem = '-----BEGIN PRIVATE KEY-----\n' +
	// 	'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDOKJBVNAYgtJVT\n' +
	// 	'i1XfRoLW/xwiM0TgEEM0GYHJm6Xr5PSXvgLWuyF1GjsRzdqq1tFu1UsDeZZ2oJwJ\n' +
	// 	'Yi6hzOfaRfc93fCXYJVWN1PM/FU19QFIT3IAOOv9eaM1ygkVCyQX+WrvdtO/UW98\n' +
	// 	'boFV/+mRdC3ffzzUUau3wCpbXk42gO5jhrAcwBQlRk6XP9F3+qJPJiM8+TdSCake\n' +
	// 	'ktfwpCOMBvylEZIVbBcBcfHcaL5iZeJwVTElxvIkBRjo/QIeRUdfYEL18Ti/7TCx\n' +
	// 	'09aZnqtDRM3kDWOU5NUngOjOkLr48ZRjcBlYOtJENiEVrnZtkOZMj6I03Xyj3knP\n' +
	// 	'X1AxqfLJAgMBAAECggEBALBps8DFaOz5usKn/A65FuOFoHx/pNOb9vYRUafE4oHv\n' +
	// 	'BYMIHQPFVEcR8DQ3FISWmNcf/DX4CNJwc7Xv53mbj1eQAZdWYTgYdRI2/CXwU7Z9\n' +
	// 	'duB641HfY8ofGZPA1G7GftdpHqHV7DLOK/mt0k1WVXeblFmpVtNVI/10mopfM8yc\n' +
	// 	'k7+sPRCpq2BSyRoZ5pfKXd0pWq67Mf9rURJNw5zBLiQxBKJWf9XCV03pSjueEvLr\n' +
	// 	'LIFkC/0+md6yAjipwspL3X9A3ePXqRt1oHt7hJTw4FTSCdfpIR2Y5J6OGg7hfS9r\n' +
	// 	'GZSKSv2Y2QlXJJRX0pOFj/1JE3j0UrZMcJSNDAP0xAUCgYEA1josWDcOELfUyyV1\n' +
	// 	'DzA9R6ueVO6t94z88QNfTOY/gNZWFOmfuV1GMyqbpUMd8nLudrDrX793jDwX6ceT\n' +
	// 	'0kQxqg/3Ishym7dBTVVBQb5PaIVRt3che9FRICzKI2aq/sJaYnOtbOc07eb/bk7M\n' +
	// 	'3b82hUjFVhR1MroyywdWGl24ZpsCgYEA9lucmAdoZpyxdKHVDdIEfm8J30cIKBIn\n' +
	// 	'GNiE5K1+yuIQooz3DUzliOgfE1jgY1BvwAMGaHP1+igNwSf+UoDRTV2pDjBmXYOG\n' +
	// 	'm4LAtpteNZLn+B6tCwF0Af/mnxM40b3LfV4NQYB3cG9YJlZ5ogO6dQOVolL1jagR\n' +
	// 	'btPOSO+uMGsCgYBsxpsPq9zTdlRxVjKrJKZpBuZdX9gr04X35ut0A5GJHMwW0E2O\n' +
	// 	'9KKZhnADqSHCosMct1a8hl7wcO7/gJw5bvD81iB5o+g10wYwezKobDar7s4AZ1g0\n' +
	// 	'I6Oav8Nf2FjJBOyaAvyzSG7iwaE/ZHm3usi3Qq0YuUiNGmiCGNaKir4AMwKBgQDw\n' +
	// 	'nS+HyQxt1DL58CnP0sTy2+6vdYgA4yHugWLimpVRAJUwvi95fRZerh/T3KVkOqa6\n' +
	// 	'yfmTQVcImeA9PJuH5ysFvimkox8HzLNG5eDlOUA9YRtRWly2eBfe8BpGWhbPu+io\n' +
	// 	'rJiT1i5R0V4uK52m4K9XJEYcgZw1W+aS8Sn0UKw3uwKBgFtDFD6a9zOUS2azeM23\n' +
	// 	'fty3AQbWhNXdhDs2YfXnpFLdR8GyF2z8ylMONFHOGz/X/boM7PasyhoefQpKOQu5\n' +
	// 	'15VHcRujbkjMW8gF2ygq6cUZ1yjscbu/YHmWcqIvfPE/pQ6vsEMzI6KQuD5ejhzH\n' +
	// 	'SDyHumauj6mCY3/HMDB8dxM1\n' +
	// 	'-----END PRIVATE KEY-----\n';

	// 	// this.getPrivateKey().then((data) => privateKey = data);
	// 	// this.getPrivatePem().then((data) => privatePem = data);
		
	// 	qz.security.setCertificatePromise(function(resolve, reject) {
	// 		console.log('Set Certificate');
	// 		resolve(privateKey);
	// 	});
	
	// 	qz.security.setSignaturePromise(function(toSign) {
	// 		return function(resolve, reject) {
	// 			try {
	// 				var pk = KJUR.KEYUTIL.getKey(privatePem);
	// 				var sig = new KJUR.crypto.Signature({"alg": "SHA1withRSA"});
	// 				sig.init(pk); 
	// 				sig.updateString(toSign);
	// 				var hex = sig.sign();
	// 				resolve(KJUR.stob64(KJUR.hextorstr(hex)));
	// 			} catch (err) {
	// 				console.error(err);
	// 				reject(err);
	// 			}
	// 		};
	// 	});

	// 	// qz.websocket.connect();
	// }

	// aster.crt
	initQZ () {
		// debugger;
		let privateKey = '-----BEGIN CERTIFICATE-----\n' +
		'MIIDvzCCAqcCFDHjPrVmPxi8aHPgw6R1sn3z8JBEMA0GCSqGSIb3DQEBCwUAMIGb\n' +
		'MQswCQYDVQQGEwJJTjESMBAGA1UECAwJVEFNSUxOQURVMRMwEQYDVQQHDApDT0lN\n' +
		'QkFUT1JFMRIwEAYDVQQKDAlBU1RFTkxBQlMxCzAJBgNVBAsMAklUMRgwFgYDVQQD\n' +
		'DA8qLmFzdGVubGFicy5jb20xKDAmBgkqhkiG9w0BCQEWGXNlbnRoYW1pbC5zQGFz\n' +
		'dGVubGFicy5jb20wHhcNMjAxMjA1MTQxNDM2WhcNMzAxMjAzMTQxNDM2WjCBmzEL\n' +
		'MAkGA1UEBhMCSU4xEjAQBgNVBAgMCVRBTUlMTkFEVTETMBEGA1UEBwwKQ09JTUJB\n' +
		'VE9SRTESMBAGA1UECgwJQVNURU5MQUJTMQswCQYDVQQLDAJJVDEYMBYGA1UEAwwP\n' +
		'Ki5hc3RlbmxhYnMuY29tMSgwJgYJKoZIhvcNAQkBFhlzZW50aGFtaWwuc0Bhc3Rl\n' +
		'bmxhYnMuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyEMsfHFk\n' +
		'1Z/itaoi8gpazJ7qE482MwS86AmuPFISYKRxCpK3ouyE1xI/JFdfpH54mGsFuRcy\n' +
		'YXO7lPt0XF1fT0N55NaGWIpJ/8EV231SiTpLuUCd1bemWD1E82BraS/s+mq0HnHT\n' +
		'4SgrF+MVNv5F+ndNvH33uqIlRuUdeIEdmMJTPPtTc7eLtImHBBp1ShGAhSbILquT\n' +
		'HtS0g4yHdvzUSZP3pm3XN5KjtnH4ZxdOcUZBCfakzwpJp5yxuSen3U9ojnZM+t2d\n' +
		'mDeqPo775sYuPXWOIPZXByzX17OBqzpRKpxhqc/miGMF8gZNma9/LrmghN8CsZ5b\n' +
		'lpcANkF82WwOBwIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQC95/zaAtP769HkgD00\n' +
		'ByBnBNUKgpzo0rrymRjbuDHjXnFqA9xvVrlkZ17WhZLgQNXCZ5fzM/khOJSr4cvI\n' +
		'sze6qYPtBlqsOAYNEJIuLE+clWYZQMZHDK+ESgeMsdtASXOYroCRGNcLp6mPu0GG\n' +
		'0yqpsCFTcZOMPohcyOkVtySyIlIqRxjWs61bYE0qoIXPL5YfAUtZbWJF/tFC/MnS\n' +
		'6FRebgLoMeYYOPqXg0NBFA9G+PJsooLdQIypq+yBts5fkwd29CcTQNTKLr9gO7lY\n' +
		'jh4GzhJkDQyIftzqP7QKtcSmCscRSyHqvvtVS/b/oVTsuRz04ZE2YJf3BJJo495J\n' +
		'Rq9D\n' +
		'-----END CERTIFICATE-----';
		let privatePem = '-----BEGIN RSA PRIVATE KEY-----\n' +
		'MIIEpQIBAAKCAQEAyEMsfHFk1Z/itaoi8gpazJ7qE482MwS86AmuPFISYKRxCpK3\n' +
		'ouyE1xI/JFdfpH54mGsFuRcyYXO7lPt0XF1fT0N55NaGWIpJ/8EV231SiTpLuUCd\n' +
		'1bemWD1E82BraS/s+mq0HnHT4SgrF+MVNv5F+ndNvH33uqIlRuUdeIEdmMJTPPtT\n' +
		'c7eLtImHBBp1ShGAhSbILquTHtS0g4yHdvzUSZP3pm3XN5KjtnH4ZxdOcUZBCfak\n' +
		'zwpJp5yxuSen3U9ojnZM+t2dmDeqPo775sYuPXWOIPZXByzX17OBqzpRKpxhqc/m\n' +
		'iGMF8gZNma9/LrmghN8CsZ5blpcANkF82WwOBwIDAQABAoIBAQCKtURN2Xi/ImQz\n' +
		'8ekMfrGPgw6ch5hB1ClICtR9AVerSprleOPq3CnSkdfcQwyC8fpzj8VCA1go+bFW\n' +
		'qqhZBW9rhlAaeaBKGVbR55pNEcumMxOZ97CbA/4api1o6ULcc46PkHK7l5nrHRhk\n' +
		'Dix2j75GknXsdc+tnHt3VGCKQ9wNHmo4m3lD/hLqc4ggEd1FtGOg/yFqc1BFv2s0\n' +
		'rRbPx0JvM5IK/ZeMtKM5ZTrpAcBFsVIau9yuY/ewHaIMcZQJHfPWhCI5/koavwv4\n' +
		'ghgp2dzVJLFkCou2ePb393nEAPsWJUUF8d4s+vFoKHhAuQzk8K2+YLuN/b1DXRUh\n' +
		'+biIgXdpAoGBAOXz7m5NnbcoMWEaQJJCUwlIFiNacqi6ivGMyHaD7k0UhTvRK6RM\n' +
		'FUt9DkLwAP9i4UhLuazAapndyosspb+1T4k3Hpkfb5yWSh0gnZ8Wu4YUyNdXAvPK\n' +
		'X5dEXvy/P7/iexIqLgIIfV+cRwgmsAyIgCPLdXLhIlOsk7Qbt3/H7a/FAoGBAN7y\n' +
		'SrwELqWM1/7SX5VxTB7KOfl0P59oJElVV0Zeawit7o119krAVYYHdB5Txg4iyLRB\n' +
		'TEADBmgUda0x2jcYkFrBnycOqbLtM5Ay3wNVohgbCmtQq7Qgb6vY8AuDv5rHN6Ga\n' +
		'1T2j+pITqZ/BcBW2u/NgUgFhnPzNrtucCYPH8ndbAoGAeesiADOAqkpSG/SqRaGK\n' +
		'mwIwUqAy6Ii3ACivZD7AyvdVSIi3Rc3dAIAWXqEXNlB7tzQHBrOiEWBJcg7C9miv\n' +
		'+cVSoMbNC02Xj+fqCh4oYIeGkL2eYBltIytp3UGdECSJMfFRIVzU9CtMceLpNkvs\n' +
		'/I10AOuiopB+Y2DKoqIiwC0CgYEAmLjlVRKQWbu3osm9zIOGH3lsaWOmya3vXYTm\n' +
		'ej/nllR/m8v44ZALhfrJIpVEkR5m2oP4lcj8tIN/cRs7Xo6nJGSKf5jdysIOlnMi\n' +
		'rggVN+oeIxFp7cRiexfqqBiiQobBpySHeug/l518jwFVpKo+6iNLScLyZYMIi0vC\n' +
		'gNGRWQ0CgYEA0FkwWqHyTouLghsVUyGdBz+ALBpxn7ql3gZJahUF+3b6eh/g41Kq\n' +
		'3Lf4v2U/EnZTkFCGId+9irPtxBHBD/0wpMD5JWH/u/7grQtPJ0Q7Uq6tleYuWjeb\n' +
		'cVHuOHkclHEZTuZu3F4nmo0+oWiMpMSHfyyCfWM7AUtIUTkbdkY0X3k=\n' +
		'-----END RSA PRIVATE KEY-----';

		// this.getPrivateKey().then((data) => privateKey = data);
		// this.getPrivatePem().then((data) => privatePem = data);
		
		qz.security.setCertificatePromise(function(resolve, reject) {
			console.log('Set Certificate');
			resolve(privateKey);
		});
	
		qz.security.setSignaturePromise(function(toSign) {
			return function(resolve, reject) {
				try {
					var pk = KJUR.KEYUTIL.getKey(privatePem);
					var sig = new KJUR.crypto.Signature({"alg": "SHA1withRSA"});
					sig.init(pk); 
					sig.updateString(toSign);
					var hex = sig.sign();
					resolve(KJUR.stob64(KJUR.hextorstr(hex)));
				} catch (err) {
					console.error(err);
					reject(err);
				}
			};
		});

		// qz.websocket.connect();
	}

	errorHandler(error: any): Observable<any> {
		return Observable.throw(error);
	}
	
	// getPrinters(): Observable<string[]> {
	// 	return Observable
	// 	.fromPromise(qz.websocket.connect().then(() => qz.printers.find()))
	// 	.map((printers: string[]) => printers);
	// }
	
	// getPrinter(printerName: string): Observable<string> {
	// 	return Observable
	// 	.fromPromise(qz.websocket.connect().then(() => qz.printers.find(printerName)))
	// 	.map((printer: string) => printer);
	// }

	getPrinters() {
		qz.websocket.connect().then(() => {
			return qz.printers.find();
		}).then((found) => {
			console.log(found);
			return found;
		}).catch((err) => {
			console.error(err);
		}).finally(() => {
			return qz.websocket.disconnect();
		});
	}
	
	getPrinter(printerName: string) {
		// return Observable
		// .fromPromise(qz.websocket.connect().then(() => qz.printers.find(printerName)))
		// .map((printer: string) => printer);
		qz.websocket.connect().then(() => {
			return qz.printers.find(printerName);
		}).then((found) => {
			console.log(found);
			return found;
		}).catch((err) => {
			console.error(err);
		}).finally(() => {
			return qz.websocket.disconnect();
		});
	}

	printHTML(printerName, htmlData) {
		// qz.printers.find(printerName).then(function(found) {
		// 	console.log("Printer: " + found);
		// 	var config = qz.configs.create(printerName);
			
		// 	qz.print(config, htmlData).then(function() {
		// 		console.log("Sent data to printer");
		// 	}).catch((err) => console.log(err));
		// }).catch((err) => {console.log(err) });
		qz.websocket.connect().then(() => {
			return qz.printers.find(printerName);
		}).then((found) => {
			var config = qz.configs.create(found);
			return qz.print(config, htmlData);
		}).catch((err) => {
			console.error(err);
		}).finally(() => {
			return qz.websocket.disconnect();
		});
	}
	
	// Print data to chosen printer
	printData(printerName: string, data: any) {
		qz.websocket.connect().then(() => {
			return qz.printers.find(printerName);
		}).then((found) => {
			var config = qz.configs.create(found);
			return qz.print(config, data);
		}).catch((err) => {
			console.error(err);
		}).finally(() => {
			return qz.websocket.disconnect();
		});
	}

	// // Print data to chosen printer
	// printData(printerName: string, data: any): Observable<any> {
	// 	qz.printers.find(printerName)
	// 	.then(function(found) {
	// 		console.log("Printer: " + found);
			
	// 		var config = qz.configs.create("test_printer");               // Exact printer name from OS
	// 		var data = ['^XA^FO50,50^ADN,36,20^FDRAW ZPL EXAMPLE^FS^XZ'];   // Raw commands (ZPL provided)
			
	// 		qz.print(config, data).then(function() {
	// 			console.log("Sent data to printer");
	// 		});
	// 	}).catch((err) => {console.log(err) });
		
	// 	const config = qz.configs.create(printerName);
		
	// 	return Observable.fromPromise(qz.print(config, data))
	// 	.map((anything: any) => anything);
	// }

	
	// Disconnect QZ Tray from the browser
	removePrinter(): void {
		qz.websocket.disconnect();
	}
}