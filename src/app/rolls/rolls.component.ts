import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from '../_models/player.model';

@Component({
  selector: 'app-rolls',
  templateUrl: './rolls.component.html',
  styleUrls: ['./rolls.component.scss']
})
export class RollsComponent {
  @Input() players: Player[] = [];
  @Input() currentPlayerIndex = 0;
  @Input() currentFrameIndex = 0;
  @Input() gameOver: boolean = true;
  @Input() tenthFrame: boolean = true;

  @Output() rollSelected = new EventEmitter<number>();

  onRollSelected(index: number): void {
    this.rollSelected.emit(index);
  }

   // Function to filter the buttons based on the remaining pins
   filterButtons(): number[] {
    const currentPlayer = this.players[this.currentPlayerIndex];
    const currentFrame = currentPlayer.frames[this.currentFrameIndex];

    if (currentFrame.roll1 === undefined) {
      // Show buttons for 0 to 10 pins for the first roll
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    } else if (currentFrame.roll1 === 10) {
      // If first roll is a strike, show all buttons from 0 to 10 for the second roll
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    } else {
      // Show buttons for 0 to remaining pins after the first roll
      const remainingPinsAfterRoll1 = 10 - currentFrame.roll1;
      return Array.from({ length: remainingPinsAfterRoll1 + 1 }, (_, i) => i);
    }
  }

}
