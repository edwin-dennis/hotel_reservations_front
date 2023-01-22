import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Reservation } from './dto/reservation';
import { Response } from './dto/response';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  baseurl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }


  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin' : 'http://127.0.0.1:8080',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',

    }),
  };


   // GET
   findById(id:number): Observable<any> {
    return this.http
      .get<Response>(this.baseurl + '/reservation',this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl));
      
  }

  findByAll(): Observable<any> {
    return this.http
      .get<Response>(this.baseurl + '/reservation',this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  post(data: Reservation): Observable<any> {
    return  this.http.post(this.baseurl + '/reservation', data, this.httpOptions);
  }

    // Error handling
    errorHandl(error:any) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        // Get client-side error
        errorMessage = error.error.message;
      } else {
        // Get server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      console.log(errorMessage);
      return throwError(() => {
        return errorMessage;
      });
    }




}
