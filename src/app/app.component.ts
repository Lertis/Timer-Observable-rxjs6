import { Component, OnInit } from '@angular/core';
import { timer, Observable, Subscription } from 'rxjs';
import { take, takeWhile, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  $valueSecond: number;
  $valueMinute: number;
  $valueHour: number;

  timerSubscription: Subscription;
  timer = timer(1000, 1000);
  currentSecond = 0;
  currentMinute = 0;
  currentHour = 0;
  endTick = 60;

  playButtonDisable = false;
  pauseButtonDisable = true;
  resumeButtonDisable = true;
  stopButtonDisable = true;

  cardStyle = 'defaultStyle';

  secondLine = document.querySelector('.second-hand');

  constructor() { }

  ngOnInit() {
  }

  play() {
    console.log('start...');
    this.cardStyle = 'playStyle';

    this.playButtonDisable = true;
    this.pauseButtonDisable = false;
    this.resumeButtonDisable = false;
    this.stopButtonDisable = false;

    this.timerSubscription = this.timer.pipe(
      map(i => i++),
      take(this.endTick + 1))
      .subscribe(iter => {
        this.currentSecond = iter;
        this.$valueSecond = ((this.currentSecond / 60) * 360) + 90;
        this.$valueMinute = ((this.currentMinute / 60) * 360) + 90;
        console.log(iter);
        if (iter === this.endTick) {
          this.timerSubscription.unsubscribe();
          this.currentMinute += 1;
          if (this.currentMinute === 60) {
            this.currentHour += 1;
            this.$valueHour = ((this.currentHour / 12) * 360) + 90;
          }
          this.play();
        }
      });
  }

  pause() {
    console.log('paused at: ', this.currentSecond);
    this.cardStyle = 'pauseStyle';

    this.playButtonDisable = true;
    this.pauseButtonDisable = true;
    this.resumeButtonDisable = false;
    this.stopButtonDisable = false;

    this.timerSubscription.unsubscribe();
  }

  resume() {
    console.log('resumed from: ', this.currentSecond + 1);
    this.cardStyle = 'resumeStyle';

    this.playButtonDisable = true;
    this.pauseButtonDisable = false;
    this.resumeButtonDisable = true;
    this.stopButtonDisable = false;

    this.timerSubscription = this.shouldStartWith(this.currentSecond + 1)
      .pipe(
        takeWhile(val => val <= this.endTick)
      )
      .subscribe(resumeTick => {
        console.log(resumeTick);
        this.currentSecond = resumeTick;
        this.$valueSecond = ((this.currentSecond / 60) * 360) + 90;
        if (resumeTick === this.endTick) {
          this.currentMinute += 1;
          this.$valueMinute = ((this.currentMinute / 60) * 360) + 90;
          this.timerSubscription.unsubscribe();
          this.play();
        }
      });
  }

  stop() {
    console.log('stopped');
    this.cardStyle = 'stopStyle';

    this.playButtonDisable = false;
    this.pauseButtonDisable = true;
    this.resumeButtonDisable = true;
    this.stopButtonDisable = true;

    this.currentMinute = 0;
    this.currentSecond = 0;
    this.currentHour = 0;
    this.$valueSecond = ((this.currentSecond / 60) * 360) + 90;
    this.$valueMinute = ((this.currentMinute / 60) * 360) + 90;
    this.$valueHour = ((this.currentHour / 12) * 360) + 90;

    this.timerSubscription.unsubscribe();
  }

  shouldStartWith(startTime: number): Observable<number> {
    return timer(1000, 1000).pipe(
      takeWhile(t => true),
      map(t => startTime + t)
    );
  }
}
