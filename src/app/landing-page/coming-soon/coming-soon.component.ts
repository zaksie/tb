import {AfterViewInit, Component, inject} from '@angular/core';
import {Location} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {Socket} from "ngx-socket-io";
import {map, tap} from "rxjs";

@Component({
  selector: 'app-coming-soon',
  standalone: false,
  templateUrl: './coming-soon.component.html',
  styleUrl: './coming-soon.component.scss'
})
export class ComingSoonComponent implements AfterViewInit {

  _location = inject(Location)
  http = inject(HttpClient)
  websocket = inject(Socket)

  back() {
    this._location.back()
  }

  ngAfterViewInit(): void {
    // this.http.get(environment.spdy_backend + '/api/v1/test').subscribe(res => console.log(res))
    this.sendMessage('hello')
  }

  sendMessage(msg: string) {
    this.websocket.emit('message', msg);
    this.websocket.emit('identity', msg);
  }

  getMessage() {
    return this.websocket.fromEvent('api/v1/chests').pipe(
      tap(data => console.log(data)),
      map(data => data.msg)
    )
  }

}
