import { Component } from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-group-select-dialog',
  standalone: false,
  templateUrl: './group-select-dialog.component.html',
  styleUrl: './group-select-dialog.component.scss'
})
export class GroupSelectDialogComponent {

  constructor(
    private ref: DynamicDialogRef
  ) { }

  chooseGroup(group: number) {
    this.ref.close(group);
  }

}
