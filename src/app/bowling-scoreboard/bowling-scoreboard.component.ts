import { Component, OnInit } from '@angular/core';
import { Player } from '../_models/player.model';
import { Frame, FrameTotals } from '../_models/frame.model';
import { BowlingService } from '../_services/bowling.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface INewPlayerForm {
  playerNameControl?: FormControl<string | null>;
}
@Component({
  selector: 'app-bowling-scoreboard',
  templateUrl: './bowling-scoreboard.component.html',
  styleUrls: ['./bowling-scoreboard.component.scss']
})
export class BowlingScoreboardComponent implements OnInit {
  currentPlayerIndex = 0;
  frameTotals: FrameTotals = {} as FrameTotals;
  players: Player[] = [];
  showForm: boolean = false;
  newPlayer: Player = {} as Player;

  newPlayerForm: FormGroup<INewPlayerForm>;
  playerNameControl: FormControl<string | null>;

  constructor(private readonly bowlingService: BowlingService) {
    this.playerNameControl = new FormControl(null, [Validators.required],);

    this.newPlayerForm = new FormGroup<INewPlayerForm>({
      playerNameControl: this.playerNameControl
    });

    this.playerNameControl.valueChanges.pipe().subscribe((name) => {
      if (name) {
        this.newPlayer.name = name;
      }
    })

  }

  ngOnInit(): void {
    this.getPlayers();
  }

  getPlayers() {
    this.bowlingService.getPlayers().subscribe((players: any) => {
      this.players = players;
    });
  }

  addPlayer(): void {
    if (this.newPlayerForm.invalid) {
      return;
    }

    const newPlayer: Player = {
      id: this.players.length + 1,
      name: this.newPlayer.name,
      frames: [
        { roll1: undefined, roll2: undefined },
        { roll1: undefined, roll2: undefined },
        { roll1: undefined, roll2: undefined },
        { roll1: undefined, roll2: undefined },
        { roll1: undefined, roll2: undefined },
        { roll1: undefined, roll2: undefined },
        { roll1: undefined, roll2: undefined },
        { roll1: undefined, roll2: undefined },
        { roll1: undefined, roll2: undefined },
        { roll1: undefined, roll2: undefined },
      ],
  };


    this.bowlingService.createPlayer(newPlayer).subscribe((res) => {
      console.log("Player created: ", res);
    });

    this.players.push(newPlayer);
    this.showForm = false;
    this.newPlayerForm.reset();
  }

  // Check if it's a strike
  isStrike(roll: number): boolean {
    return roll === 10;
  }

  // Check if it's a spare
  isSpare(roll1: number, roll2: number): boolean {
    return !this.isStrike(roll1) && roll1 + roll2 === 10;
  }

  // Function to calculate the score of each frame
  calculateFrameScore(frames: Frame[]): number[] {
    // Array to store cumulative frame scores
    const cumulativeFrameScores: number[] = [];
    // Array to store the score of each frame
    const frameScores: number[] = [];
    let cumulativeTotal = 0;

    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      const { roll1, roll2 } = frame;

      if (this.isStrike(roll1 ?? 0)) {
        const nextFrame = frames[i + 1];
        const nextNextFrame = frames[i + 2];
        let frameScore = 10;

        if (nextFrame) {
          const nextFrameScore = (nextFrame.roll1 ?? 0) + (nextFrame.roll2  ?? 0);
          frameScore += nextFrameScore;

          if (this.isStrike(nextFrame.roll1 ?? 0)) {
            if (nextNextFrame) {
              frameScore += (nextNextFrame.roll1 ?? 0) + (nextNextFrame.roll2 ?? 0);
            }
          } else {
            frameScore += nextFrame.roll2 ?? 0;
          }
        }
        frameScores.push(frameScore);
        cumulativeFrameScores.push(frameScore);
      } else if (this.isSpare((roll1 ?? 0), (roll2 ?? 0))) {
        const nextFrame = frames[i + 1];
        if (nextFrame) {
          const frameScore = 10 + (nextFrame.roll1 ?? 0);
          frameScores.push(frameScore);
          cumulativeFrameScores.push(frameScore);
        }
      } else {
        const frameScore = (roll1  ?? 0) + (roll2 ?? 0);
        frameScores.push(frameScore);
        cumulativeFrameScores.push(frameScore);
      }

      cumulativeTotal += cumulativeFrameScores[cumulativeFrameScores.length - 1];
      cumulativeFrameScores[cumulativeFrameScores.length - 1] = cumulativeTotal;
    }

    // Handle the 10th frame
    const lastFrame = frames[frames.length - 1];

    if (lastFrame.roll3) {
      cumulativeTotal += (lastFrame.roll2  ?? 0) + lastFrame.roll3;
      cumulativeFrameScores[frames.length - 1] = cumulativeTotal;

      frameScores[frames.length - 1] = (lastFrame.roll1 ?? 0) + (lastFrame.roll2 ?? 0) + lastFrame.roll3
    }

    this.frameTotals = { cumulativeFrameScores: cumulativeFrameScores, frameScores: frameScores };

    return this.frameTotals.cumulativeFrameScores;
  }


  // Function to calculate the total score for each player
  calculateTotalScore(frames: Frame[]): number {
    this.calculateFrameScore(frames);

    const totalScore = this.frameTotals.frameScores.reduce((sum, value) => sum + value, 0);

    return totalScore;
  }

  // // Method to simulate the game play for all players
  simulateGamePlay() {
    const totalFrames = 10;
    const totalPlayers = this.players.length;

    for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
      for (let playerIndex = 0; playerIndex < totalPlayers; playerIndex++) {
        const currentPlayer = this.players[playerIndex];
        const currentFrame = currentPlayer.frames[frameIndex];

        // Simulate player making the first roll
        const pinsKnockedDownRoll1 = Math.floor(Math.random() * 11); // Generate random number between 0 and 10
        currentFrame.roll1 = pinsKnockedDownRoll1;

        // Simulate player making the second roll
        const remainingPinsAfterRoll1 = 10 - pinsKnockedDownRoll1;

        const pinsKnockedDownRoll2 = frameIndex === 9
          ? Math.floor(Math.random() * (remainingPinsAfterRoll1)) // Generate random number between 0 and remaining pins for 10th frame
          : Math.floor(Math.random() * (11 - currentFrame.roll1)); // Generate random number between 0 and 10 for other frames
        currentFrame.roll2 = pinsKnockedDownRoll2;

        // Check if it's a strike or spare
        if (this.isStrike(currentFrame.roll1)) {
          currentFrame.score = 10 + (this.players[playerIndex + 1]?.frames[frameIndex]?.roll1 ?? 0);
        } else if (this.isSpare(currentFrame.roll1, currentFrame.roll2)) {
          currentFrame.score = 10 + (this.players[playerIndex + 1]?.frames[frameIndex]?.roll1 ?? 0);
        } else {
          currentFrame.score = currentFrame.roll1 + currentFrame.roll2;
        }

        // Handle the 10th frame
        if (frameIndex === totalFrames - 1) {
          if (this.isStrike(currentFrame.roll1)) {
            const bonusRoll = Math.floor(Math.random() * 11); // Generate random number between 0 and 10
            currentFrame.roll3 = bonusRoll;
            currentFrame.score += bonusRoll;
          } else if (this.isStrike(currentFrame.roll2) || this.isSpare(currentFrame.roll1, currentFrame.roll2)) {
              const bonusRoll = Math.floor(Math.random() * 11); // Generate random number between 0 and 10
              currentFrame.roll3 = bonusRoll;
              currentFrame.score += bonusRoll;
          } else {
            currentFrame.roll3 = undefined;
          }
        }

        // Update the player's frames and calculate total score
        currentPlayer.frames[frameIndex] = currentFrame;
        this.calculateTotalScore(currentPlayer.frames);
      }
    }
  }

  showNewPlayerForm() {
    this.showForm = true;
  }

  startNewGane(): void {
    this.players = [];
  }
}
