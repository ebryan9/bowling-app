import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface INewPlayerForm {
  playerNameControl?: FormControl<string | null>;
}
@Component({
  selector: 'app-add-player-form',
  templateUrl: './add-player-form.component.html',
  styleUrls: ['./add-player-form.component.scss']
})
export class AddPlayerFormComponent {
  @Output() newPlayerCreated = new EventEmitter<string>();
  @Output() displayForm = new EventEmitter<boolean>();

  playerName: string = '';

  newPlayerForm: FormGroup<INewPlayerForm>;
  playerNameControl: FormControl<string | null>;

    constructor() {
    this.playerNameControl = new FormControl(null, [Validators.required],);

    this.newPlayerForm = new FormGroup<INewPlayerForm>({
      playerNameControl: this.playerNameControl
    });

    this.playerNameControl.valueChanges.pipe().subscribe((name) => {
      if (name) {
       this.createNewPlayer(name);
       this.playerName = name;

      }
    })

  }

  createNewPlayer(playerName: string) {
    if (this.newPlayerForm.invalid) {
      return;
    }

    this.newPlayerCreated.emit(playerName);
    this.showForm(false);
    this.newPlayerForm.reset();
  }

  showForm(evt: boolean) {
    this.displayForm.emit(evt);
  }
}
