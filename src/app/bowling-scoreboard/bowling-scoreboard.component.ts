import { Component, OnInit } from '@angular/core';
import { Player } from '../_models/player.model';
import { Frame, FrameTotals } from '../_models/frame.model';
import { BowlingService } from '../_services/bowling.service';

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
  selectedButtons: { [playerIndex: number]: number[] } = {};
  remainingPinsAfterRoll1: number = 10;

  get isTenthFrame(): boolean {
    return this.currentFrameIndex === 9;
  }

  get isGameOver(): boolean {
    return this.currentFrameIndex === 10 && this.currentPlayerIndex === 0;
  }

  constructor(private readonly bowlingService: BowlingService) {}

  ngOnInit(): void {
    this.getPlayers();
  }

  getPlayers() {
    this.bowlingService.getPlayers().subscribe((players: any) => {
      this.players = players;
    });
  }

  addPlayer(playerName: string): void {
    const newPlayer: Player = {
      id: this.players.length + 1,
      name: playerName,
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


    this.bowlingService.createPlayer(newPlayer).subscribe((player) => {
      console.log(`Player created: ${JSON.stringify(player)}.`);
    });

    this.players.push(newPlayer);
    // this.showForm = false;
  }

  // Check if it's a strike
  isStrike(roll: number): boolean {
    return roll === 10;
  }

  // Check if it's a spare
  isSpare(roll1: number, roll2: number): boolean {
    return !this.isStrike(roll1) && roll1 + roll2 === 10;
  }

  // Method to calculate the score for each frame
  calculateFrameScore(frames: Frame[]): number[] {
    // Array to store cumulative frame scores
    const cumulativeFrameScores: number[] = [];
    // Array to store the score of each frame
    const frameScores: number[] = [];
    let cumulativeTotal = 0;

    for (let i = 0; i <= frames.length - 1; i++) {
      const frame = frames[i];
      const { roll1, roll2 } = frame;
      let frameScore = 0; // Initialize frameScore

      if (this.isStrike(roll1 ?? 0)) {
        const nextFrame = frames[i + 1];
        const nextNextFrame = frames[i + 2];
        frameScore = 10;

        if (nextFrame) {
          const nextFrameScore = (nextFrame.roll1 ?? 0) + (nextFrame.roll2 ?? 0);
          frameScore += nextFrameScore;

          if (this.isStrike(nextFrame.roll1 ?? 0)) {
            if (nextNextFrame) {
              frameScore += nextNextFrame.roll1 ?? 0;
              if (nextNextFrame.roll1 === 10 && i === 8) {
                frameScore += nextNextFrame.roll2 ?? 0;
              }
            }
          }
        }
      } else if (this.isSpare(roll1 ?? 0, roll2 ?? 0)) {
        const nextFrame = frames[i + 1];
        if (nextFrame) {
          frameScore = 10 + (nextFrame.roll1 ?? 0);
        }
      } else {
        frameScore = (roll1 ?? 0) + (roll2 ?? 0);
      }

      frameScores.push(frameScore);
      if (i < 9) {
        cumulativeTotal += frameScore; // Add to cumulativeTotal only until the 9th frame
      }
      cumulativeFrameScores.push(cumulativeTotal);
    }

    // Handle the 10th frame
    const lastFrame = frames[frames.length - 1];

    if (lastFrame.roll3 !== undefined) {
      cumulativeTotal += (lastFrame.roll1 ?? 0) + (lastFrame.roll2 ?? 0) + (lastFrame.roll3 ?? 0);
      cumulativeFrameScores[frames.length - 1] = cumulativeTotal;
      frameScores[frames.length - 1] = (lastFrame.roll1 ?? 0) + (lastFrame.roll2 ?? 0) + (lastFrame.roll3 ?? 0);
    } else if (lastFrame.roll2 !== undefined) {
      // Special handling for the 10th frame if it's a spare
      cumulativeTotal += (lastFrame.roll1 ?? 0) + (lastFrame.roll2 ?? 0);
      cumulativeFrameScores[frames.length - 1] = cumulativeTotal;
      frameScores[frames.length - 1] = (lastFrame.roll1 ?? 0) + (lastFrame.roll2 ?? 0);
    }

    this.frameTotals = { cumulativeFrameScores: cumulativeFrameScores, frameScores: frameScores };
    return this.frameTotals.cumulativeFrameScores;
  }


  // Method to calculate the total score for each player
  calculateTotalScore(frames: Frame[]): number {
    this.calculateFrameScore(frames);

    const totalScore = this.frameTotals.frameScores.reduce((sum, value) => sum + value, 0);

    return totalScore;
  }

  showNewPlayerForm(show: boolean) {
    this.showForm = show;
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
    if (!currentFrame.roll3 && this.currentFrameIndex === 9) {
      // Check if there's a third roll (bonus roll) in the 10th frame
      if (this.isStrike(currentFrame.roll1 ?? 0)) {
        // Bonus roll
        currentFrame.roll3 = 0;
        this.currentRollIndex = 3;
      } else if (this.isStrike(currentFrame.roll2 ?? 0) || this.isSpare(currentFrame.roll1 ?? 0, currentFrame.roll2 ?? 0)) {
        // Bonus roll
        currentFrame.roll3 = 0;
        this.currentRollIndex = 3;
      } else {
        // All rolls in the 10th frame have been completed, move to the next player's next frame
        this.currentPlayerIndex = 0; // Move back to the first player
        this.currentFrameIndex++;
        this.currentRollIndex = 1; // Reset the current roll index to 1 for the first roll of the next frame
      }
    } else {
      // Move to the next frame for the first player
      this.currentPlayerIndex++;
      if (this.currentPlayerIndex === this.players.length) {
        // Move back to the first player and advance to the next frame
        this.currentPlayerIndex = 0;
        this.currentFrameIndex++;
        this.currentRollIndex = 1; // Reset the current roll index to 1 for the first roll of the next frame
      } else {
        // Reset the current roll index to 1 for the first roll of the next frame for the next player
        this.currentRollIndex = 1;
      }
    }

    // Check if the game is over
    if (this.isGameOver) {
      this.currentPlayerIndex = 0; // Reset back to the first player
    }
  }

  // Method to move to the next player
  moveToNextPlayer() {
    if (this.currentPlayerIndex < this.players.length - 1) {
      // Move to the next player
      this.currentPlayerIndex++;
    } else {
      // Move back to the first player
      this.currentPlayerIndex = 0;
    }
  }

  // Method to move to the next player's next frame
  moveToNextPlayerNextFrame() {
    const currentPlayer = this.players[this.currentPlayerIndex];
    const currentFrame = currentPlayer.frames[this.currentFrameIndex];

    // Check if all players have completed their turns in the current frame
    const allPlayersCompletedFrame = this.players.every(
      (player) => player.frames[this.currentFrameIndex].roll1 !== undefined && player.frames[this.currentFrameIndex].roll2 !== undefined
    );

    if (allPlayersCompletedFrame) {
      // Check if it's the last player's turn in the 10th frame
      if (this.currentPlayerIndex === this.players.length - 1) {
        // Move to the next frame for the first player
        this.currentPlayerIndex = 0;
        this.currentFrameIndex++;
        this.currentRollIndex = 1; // Reset the current roll index to 1 for the first roll of the next frame
      } else {
        // Move to the next player for the current frame
        this.moveToNextPlayer();
      }
    } else {
      // Move to the next player for the current frame
      this.moveToNextPlayer();
    }
  }

  // Method to handle when a roll is made
  onRollButtonClicked(pins: number) {
    const currentPlayer = this.players[this.currentPlayerIndex];
    const currentFrame = currentPlayer.frames[this.currentFrameIndex];

    if (!currentFrame.roll1) {
      currentFrame.roll1 = pins;
      if (this.isStrike(pins) && this.currentFrameIndex !== 9) {
        // Set roll2 to 0 and move to the next frame or player
        currentFrame.roll2 = 0;
        this.moveToNextPlayerNextFrame();
      }
    } else if (!currentFrame.roll2) {
      currentFrame.roll2 = pins;

      if (this.currentFrameIndex === 9) {
        // Handle 10th frame
        if (this.isStrike(currentFrame.roll1)) {
          // For a strike in the 10th frame, allow two additional rolls
          this.currentRollIndex = 3;
        } else if (this.isSpare(currentFrame.roll1, currentFrame.roll2)) {
          // For a spare in the 10th frame, allow one additional roll
          this.currentRollIndex = 3;
        } else {
          // Regular frame, move to the next frame or player
          this.moveToNextPlayerNextFrame();
        }
      } else {
        // Regular frame, move to the next frame or player
        this.moveToNextPlayerNextFrame();
      }
    } else {
      // Third roll in the 10th frame
      if (this.currentFrameIndex === 9 && this.currentRollIndex === 3) {
        currentFrame.roll3 = pins;
        this.moveToNextPlayerNextFrame();
      }
    }
  }
}
