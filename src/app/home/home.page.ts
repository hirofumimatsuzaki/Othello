
import { Component, OnInit, ElementRef } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AdOptions, AdSize, AdPosition } from '@rdlabo/capacitor-admob';
import * as p5 from 'p5';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isAdsense = true;
  curve: any;
  canvasid: any;
  canvasSizeX = 500;
  canvasSizeY = 500;

  board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ];
  turn = 1;
  s = 50;
  col:any;
  row:any;
  kururi = 0;
  count = 60;
  white = 0;
  black = 0;
  yourTurn="白の番です";


  private ID = 'HomePage';
  log(func, line = '') {
    console.log(this.ID + '::' + func + '|' + line);
  }
  constructor(
    private el: ElementRef
  ) {
    this.log('constructor');
  }
  ngOnInit() {
    this.log('ngOnInit');
    const p5obj = new p5(p => {
      p.setup = () => {
        this.setup(p);
      };
      p.draw = () => {
        this.draw(p);
      };
    }, this.el.nativeElement);
  }
  displayAdMob() {
    const options: AdOptions = {
      adId: 'ca-app-pub-3940256099942544/6300978111',
      adSize: AdSize.BANNER,
      position: AdPosition.BOTTOM_CENTER,
    };
    Plugins.AdMob.showBanner(options).then(
      success => this.isAdsense = true,
      error => this.isAdsense = false
    );
  }

  hideAdMob() {
    Plugins.AdMob.hideBanner().then(
      success => this.isAdsense = false
    );
  }
  setup(p) {
    this.log('setup');
    const c = document.querySelector('#canvasContainer');
    this.canvasSizeX=p.displayWidth;
    p
      .createCanvas(this.canvasSizeX, this.canvasSizeX)
      .parent(c);
    this.s = p.width / 8;
   this.displayAdMob();
  }
  draw(p) {
    p.background(0, 140, 0);
if(this.turn==1){
  this.yourTurn="白の番です";
}else{
  this.yourTurn="黒の番です";
}

if(this.count==0){
  this.result(p); 
 }
    // print(kururi);
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        p.stroke(0);
        p.line(j * this.s, 0, j * this.s, this.canvasSizeY);
        p.line(0, i * this.s, this.canvasSizeX, i * this.s);
        if (this.board[i][j] == 1) {
          p.fill(255);
          p.ellipse(i * this.s + this.s/2, j * this.s + this.s/2,this.s-10, this.s-10);
        }
        if (this.board[i][j] == 2) {
          p.fill(0);
          p.ellipse(i * this.s + this.s/2, j * this.s + this.s/2, this.s-10, this.s-10);
        }
      }
    }
    
    if(p.mouseIsPressed){
      this.row = p.floor(p.mouseX / this.s);
      this.col = p.floor(p.mouseY / this.s);
      if (this.getpos(this.row, this.col) == 0) {
        if (this.turn == 1) {
          this.kururi = 0;
          this.board[this.row][this.col] = 1;
    
          for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
              this.serachReverse(this.row, this.col, i, j);
            }
          }
          this.turn = 2;
    
          if (this.kururi == 0) {
            this.board[this.row][this.col] = 0;
            this.turn = 1;
            this.count++;

          }
          this.count--;

        } else if (this.turn == 2) {

          this.kururi = 0;
          this.board[this.row][this.col] = 2;
    
          for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
              this.serachReverse(this.row, this.col, i, j);
            }
          }
          this.turn = 1;
    
          if (this.kururi == 0) {
            this.board[this.row][this.col] = 0;
            this.turn = 2;
            this.count++;
 
          }
          this.count--;

        }
    
    
      }
    }
  }
  result(p) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let c = this.getpos(i, j);
        if (c == 1) {
          this.white++;
        } else if (c == 2) {
          this.black++;
        }
      }
    }
    if (this.white > this.black) {
      this.yourTurn="白の勝ちです！";
    } else {
      this.yourTurn="黒の勝ちです！";
    }
  }

  
getpos(x:number, y:number) {
  let xin = x >= 0 && x < 8;
  let yin = y >= 0 && y < 8;
  if (xin && yin) {
    return this.board[x][y];
  } else {
    return 0;
  }
}
setpos(x:number, y:number, num:number) {
  let xin = x >= 0 && x < 8;
  let yin = y >= 0 && y < 8;
  if (xin && yin) {
    this.board[x][y] = num;
  }
}
serachReverse(x:number, y:number, vx:number, vy:number) {
  let state = this.getpos(x, y);
  let Opponent=0;
  if (state == 1) {
    Opponent = 2;
  } else {
    Opponent = 1;
  }
  let hit = false;
  let step = 0;
  let stepx = x + vx;
  let stepy = y + vy;
  while (!hit) {
    if (this.getpos(stepx, stepy) == 0) {
      hit = true;
    }

    if (this.getpos(stepx, stepy) == Opponent) {
      stepx += vx;
      stepy += vy;
      step++;
    }
    if (step == 0) {
      if (this.getpos(stepx, stepy) == state) {
        hit = true;
      }
    }
    if (step >= 1) {
      if (this.getpos(stepx, stepy) == state) {
        hit = true;
        this.kururi++;
        let fillx = stepx;
        let filly = stepy;
        for (let i = 0; i < step; i++) {
          fillx -= vx;
          filly -= vy;
          this.setpos(fillx, filly, state);
        }
      }
    }
  }
}
restart(){
  this.board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ];
  this.turn = 1;
  this.kururi = 0;
  this.count = 60;
  this.white = 0;
  this.black = 0;
  this.yourTurn="白の番です";
}

turnSkip() {
   this.turn++;
    if(this.turn>2){
     this.turn=1; 
    }
  }   

  
 }
