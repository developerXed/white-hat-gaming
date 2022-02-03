import {Component, OnInit} from '@angular/core';
import {DashboardService} from "../services/dashboard.service";
import {Igames} from "../models/igames";
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: any = {};
  searchWord: any;
  filtered: Igames[] | undefined;

  constructor(
    private dashBoardService: DashboardService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.searchWord = params.name;
      console.log('params', this.searchWord);
      this.getGames();
    })
  }

  getGames() {
    this.dashBoardService.getAllGames().subscribe((res: any) => {
      this.game = res;
      this.filterByChosenGame()
    });
  }

  filterByChosenGame() {
    this.filtered = this.game.filter((items: any) => items?.categories?.includes(this.searchWord))
  }

}
