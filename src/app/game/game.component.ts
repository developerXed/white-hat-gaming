import {Component, OnInit} from '@angular/core';
import {DashboardService} from "../services/dashboard.service";
import { Ijackpots } from "../models/igames";
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from "rxjs";
import {Subscription, timer} from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  games: any[] = [];
  selectedGameCategory: string;
  otherCategories: string[] = ['fun', 'virtual', 'classic', 'ball'];
  jackpots: Ijackpots[] = [];
  isNotNewOrTopCategory: boolean = false;
  timeSubscription: Subscription;

  constructor(
    private dashBoardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // remove '/' from url path
    let urlPath = this.router.url.replace('\/','');
    // remove everything after first '-' to filter by Category below
    // i.e. top, new instead top-games, new-games
    this.selectedGameCategory = urlPath.split('-')[0];

    if (this.selectedGameCategory === 'top' || this.selectedGameCategory === 'new') {
      this.getSelectedCategoryGame();
    } else {
      this.isNotNewOrTopCategory = true;
      this.getSelectedCategoryGame();
    }

    //Update Data from Api call every 5 seconds
    this.timeSubscription = timer(0, 5000).pipe(
        map(() => {
          this.getSelectedCategoryGame(); // load data contains the http request
        })
    ).subscribe();
  }

  getSelectedCategoryGame() {
    let allGames: any = []
    this.dashBoardService
        .getAllGames()
        .pipe(
            switchMap((games: any) => {
              allGames = games;

              return this.dashBoardService.getJackpotGames();
            })
        )
        .subscribe((jackpots:any) => {
          this.jackpots = jackpots;

          // add property jackpots to relevant game
          for (let i = 0; i < this.jackpots.length; i++) {
            for (let j = 0; j < allGames.length; j++) {
              if (allGames[j].id === this.jackpots[i].game) {
                allGames[j].jackpot = this.jackpots[i].amount;
                this.games = allGames;
              }
            }
          }

          this.games = allGames.filter((game: any) => {
            if (this.selectedGameCategory === 'other') {
              for (let key in this.otherCategories) {
                if (game.categories.includes(this.otherCategories[key])) {
                  return game;
                }
              }
            } else {
              return game.categories.includes(this.selectedGameCategory)
            }
          });
      });
  }

  ngOnDestroy(): void {
    this.timeSubscription.unsubscribe();
  }
}
