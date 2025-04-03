import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, of, tap} from "rxjs";
import {environment} from "../../environments/environment";
import {Socket} from "ngx-socket-io";
import {catchError} from "rxjs/operators";
import {Currency, Order} from "../account/currency.model";

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = environment.backend + '/api/v1/payment'; // Proxied to NestJS
  websocket = inject(Socket)
  iconCached: {[key: string]: boolean} ={}
  constructor(private http: HttpClient) {}

  createPayment(payload: any): Observable<any> {
    return this.http.post( this.apiUrl+ `/create`, payload);
  }

  httpGetPaymentStatus(paymentId: string): Observable<any> {
    return this.http.get(this.apiUrl + `/status/${paymentId}`);
  }

  wssGetPaymentStatus(paymentId: string) {
    return this.websocket.fromEvent(`api/v1/payment/${paymentId}`).pipe(
      tap(wsdata => console.log({wsdata})),
      catchError(error => {
        console.error('Status check failed:', error)
        return of({error})
      })
    )
  }

  getCurrencies(): Observable<Currency[]> {
    return this.http.get<Currency[]>(this.apiUrl + `/currencies`)
  }

  getMinimum(){
    return this.http.get(this.apiUrl + `/minimum`);
  }

  getPendingOrders() {
    return this.http.get<Order[]>(this.apiUrl + `/status`).pipe(map(x => x[0]));
  }

  cancelPayment(paymentId: string) {
    return this.http.delete(this.apiUrl + `/status/${paymentId}`)
  }

  useCredit() {
    return this.http.post(this.apiUrl + `/use-credit`, {})
  }
}


