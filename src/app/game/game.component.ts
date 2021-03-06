import {Component, OnInit} from '@angular/core';
import {DashboardService} from "../services/dashboard.service";
import { Ijackpots } from "../models/igames";
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subject, switchMap, takeUntil, takeWhile } from "rxjs";
import {Subscription, timer} from 'rxjs';
import { Title } from "@angular/platform-browser";

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
  isDestroyed: Subject<void> = new Subject<void>();

  constructor(
    private dashBoardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    // remove '/' from url path
    let urlPath = this.router.url.replace('\/','');

    // remove any special chars from url name
    let title = urlPath.replace(/[^\w\s]/gi, " ");
    const separatorWords = title.split(' ');

    // make space of every word and capitalize it
    title = separatorWords.map((title) => {
      return title[0].toUpperCase() + title.substring(1);
    }).join(" ");

    // set dynamic title of the page
    this.titleService.setTitle(title);

    // remove everything after first '-' to filter by Category below
    // i.e. top, new instead top-games, new-games
    this.selectedGameCategory = urlPath.split('-')[0];

    if (this.selectedGameCategory === 'top' || this.selectedGameCategory === 'new') {
      this.getSelectedCategoryGame();
    } else {
      this.isNotNewOrTopCategory = true;
      this.getSelectedCategoryGame();
    }

    // Update Data from Api call every 5 seconds
    timer(0, 5000)
        .pipe(
            takeUntil(this.isDestroyed),
            map(() => {
              // load data contains the http request
              this.getSelectedCategoryGame();
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
    this.isDestroyed.next();
    this.isDestroyed.complete();
  }
}
