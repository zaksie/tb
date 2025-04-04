import {AfterViewInit, Component, inject} from '@angular/core';
import {Location} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {Socket} from "ngx-socket-io";
import {map, tap} from "rxjs";
import {PlatformService} from "../../services/platform.service";
import {Title} from "@angular/platform-browser";
import {titles} from "../../../environments/texts";

@Component({
  selector: 'app-coming-soon',
  standalone: false,
  templateUrl: './coming-soon.component.html',
  styleUrl: './coming-soon.component.scss',
  //host: {ngSkipHydration: 'true'},
})
export class ComingSoonComponent implements AfterViewInit {

  _location = inject(Location)
  http = inject(HttpClient)
  websocket = inject(Socket)
  platform = inject(PlatformService)

  constructor() {
    const titleService = inject(Title)
    titleService.setTitle(titles.comingSoon);
  }
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

      console.log('getting events from websocker')
      return this.websocket.fromEvent('api/v1/chests').pipe(
        tap(wsdata => console.log({wsdata})),
        map(data => data.msg)
      )
  }

}
