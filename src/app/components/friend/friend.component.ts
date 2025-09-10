import {Component, Input} from '@angular/core';
import {Participant} from '../../interfaces/participant';
import {UtilsService} from '../../services/utils.service';

@Component({
  selector: 'um-friend',
  standalone: false,
  templateUrl: './friend.component.html',
  styleUrl: './friend.component.scss'
})
export class FriendComponent {
    @Input('friend') friend: Participant | undefined;
    progress: number = 0;

    constructor(
      protected utils: UtilsService
    ) {
    }

  pct(r: any): number {
    const v = (Number(r?.bereitsZurueckgelegt) / Number(r?.gemeldet)) * 100;
    return Number.isFinite(v) ? v : 0;
  }
  remaining(r: any): number {
    const v = Number(r?.gemeldet) - Number(r?.bereitsZurueckgelegt);
    return v;
  }

    ngOnInit() {
      this.progress = Math.round((100 / this.friend?.gemeldet! * this.friend?.bereitsZurueckgelegt!) * 100 ) / 100
      console.log(this.friend)
    }
}
