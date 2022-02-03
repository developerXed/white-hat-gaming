import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) { }

  getAllGames() {
    const api = 'http://stage.whgstage.com/front-end-test/games.php'
    return this.httpClient.get(api);
  }

  getJackpotGames() {
    const api = 'http://stage.whgstage.com/front-end-test/jackpots.php';
    return this.httpClient.get(api);
  }
}
