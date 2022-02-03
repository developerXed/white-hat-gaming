import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  api = 'http://stage.whgstage.com/front-end-test/';

  constructor(private httpClient: HttpClient) { }

  getAllGames() {
    return this.httpClient.get(this.api + 'games.php');
  }

  getJackpotGames() {
    return this.httpClient.get(this.api + 'jackpots.php');
  }
}
