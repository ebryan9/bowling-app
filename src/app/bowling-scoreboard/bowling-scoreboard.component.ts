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
  currentPlayerIndex: number = 0;
  currentRollIndex: number = 0;
  currentFrameIndex: number = 0;
  frameTotals: FrameTotals = {} as FrameTotals;
  players: Player[] = [];
  showForm: boolean = false;
  newPlayer: Player = {} as Player;
  selectedButtons: { [playerIndex: number]: number[] } = {};
  remainingPinsAfterRoll1: number = 10;

  newPlayerForm: FormGroup<INewPlayerForm>;
  playerNameControl: FormControl<string | null>;

  get isTenthFrame(): boolean {
    return this.currentFrameIndex === 9;
  }

  get isGameOver(): boolean {
    return this.currentFrameIndex === 10 && this.currentPlayerIndex === 0;
  }

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

  showNewPlayerForm() {
    this.showForm = true;
  }

  startNewGane(): void {
    this.players = [];
    this.currentPlayerIndex = 0;
    this.currentRollIndex = 0;
    this.currentFrameIndex = 0;
  }

  // Method to move to the next frame
  moveToNextFrame() {
    const currentPlayer = this.players[this.currentPlayerIndex];
    const currentFrame = currentPlayer.frames[this.currentFrameIndex];

    // Check if it's the 10th frame
    if (this.currentFrameIndex === 9) {
      // Check if there's a third roll (bonus roll) in the 10th frame
      if (!currentFrame.roll3) {
        // Move to the bonus roll
        currentFrame.roll3 = 0;
        this.currentRollIndex = 3; // Set the current roll index to 3 for the bonus roll
      } else {
        // All rolls in the 10th frame have been completed, move to the next player
        this.currentPlayerIndex++;
        this.currentFrameIndex = 0; // Move back to the first frame for the next player
        this.currentRollIndex = 1; // Reset the current roll index to 1 for the first roll
      }
    } else {
      // Move to the next frame
      this.currentFrameIndex++;
      this.currentRollIndex = 1; // Reset the current roll index to 1 for the first roll
    }

    // Check if the game is over
    if (this.isGameOver) {
      this.currentPlayerIndex = 0; // Reset back to the first player
    }
  }

  // Method to handle when a button is clicked
  onRollButtonClicked(pins: number) {
    const currentPlayer = this.players[this.currentPlayerIndex];
    const currentFrame = currentPlayer.frames[this.currentFrameIndex];

    if (!currentFrame.roll1) {
      currentFrame.roll1 = pins;
      if (this.isStrike(pins)) {
        // Set roll2 to 0 and move to the next frame or player
        currentFrame.roll2 = 0;

        if (this.currentFrameIndex === 9) {
          // 10th frame, check if it's the last player or not
          if (this.currentPlayerIndex === this.players.length - 1) {
            // Last player, move to the next frame
            this.moveToNextFrame();
          } else {
            // Move to the next player
            this.currentPlayerIndex++;
          }
        } else {
          // Regular frame, move to the next frame or player
          if (this.currentPlayerIndex === this.players.length - 1) {
            this.moveToNextFrame();
          } else {
            // Move to the next player
            this.currentPlayerIndex++;
          }
        }
      }
    } else if (!currentFrame.roll2) {
      currentFrame.roll2 = pins;

      if (this.currentFrameIndex === 9) {
        // 10th frame
        if (this.isStrike(currentFrame.roll1) || this.isSpare(currentFrame.roll1, currentFrame.roll2)) {
          // Strike or spare scored, move to the next frame or player
          if (currentFrame.roll1 === 10 && currentFrame.roll2 === 0) {
            // If the first roll is a strike, allow an extra roll in the 10th frame
            // Do nothing here, wait for the third roll to be set
          } else if (this.isSpare(currentFrame.roll1, currentFrame.roll2)) {
            // If a spare is scored, allow two rolls in the 10th frame
            if (this.currentPlayerIndex === this.players.length - 1) {
              // Last player, move to the next frame
              this.moveToNextFrame();
            } else {
              // Move to the next player
              this.currentPlayerIndex++;
            }
          } else {
            this.moveToNextFrame();
          }
        } else {
          // Neither strike nor spare, move to the next frame or player
          this.moveToNextFrame();
        }
      } else {
        // Regular frame
        if (this.isStrike(currentFrame.roll1)) {
          // Strike scored, set roll2 to 0 and move to the next frame or player
          currentFrame.roll2 = 0;

          // Last player, move to the next frame
          if (this.currentPlayerIndex === this.players.length - 1) {
            this.moveToNextFrame();
          } else {
            // Move to the next player
            this.currentPlayerIndex++;
          }
        } else if (currentFrame.roll1 + currentFrame.roll2 === 10) {
          // Spare scored, move to the next frame or player
          if (this.currentPlayerIndex === this.players.length - 1) {
            // Last player, move to the next frame
            this.moveToNextFrame();
          } else {
            // Move to the next player
            this.currentPlayerIndex++;
          }
        } else {
          // Neither strike nor spare, move to the next frame or player
          if (this.currentPlayerIndex === this.players.length - 1) {
            // Last player, move to the next frame
            this.moveToNextFrame();
          } else {
            // Move to the next player
            this.currentPlayerIndex++;
          }
        }
      }
    } else if (this.currentFrameIndex === 9 && !currentFrame.roll3) {
      // 10th frame, third roll
      currentFrame.roll3 = pins;

      if (this.currentPlayerIndex === this.players.length - 1) {
        // Last player, move to the next frame
        this.moveToNextFrame();
      } else {
        // Move to the next player
        this.currentPlayerIndex++;
      }
    }
  }

}
