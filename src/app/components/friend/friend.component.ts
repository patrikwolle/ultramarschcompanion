import {Component, Input} from '@angular/core';
import {Participant} from '../../interfaces/participant';

@Component({
  selector: 'um-friend',
  standalone: false,
  templateUrl: './friend.component.html',
  styleUrl: './friend.component.scss'
})
export class FriendComponent {
    @Input('friend') friend: Participant | undefined;
    progress: number = 0;

    ngOnInit() {
      this.progress = Math.round((100 / this.friend?.gemeldet! * this.friend?.bereitsZurueckgelegt!) * 100 ) / 100
    }
}
