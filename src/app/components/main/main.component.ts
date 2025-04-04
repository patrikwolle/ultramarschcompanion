import {Component, OnInit} from '@angular/core';
import {UmServiceService} from '../../services/um-service.service';
import {DomParserService} from '../../services/dom-parser.service';
import {AllParticipant, Participant} from '../../interfaces/participant';

@Component({
  selector: 'um-main',
  standalone: false,
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {

  isLoading = true;

  selectUserId: string | undefined;
  selectedUser: Participant | undefined;
  selectedUserGroup: string = '';

  allUsers: AllParticipant = {
    hike: [],
    hikeRun: [],
    hikeRunBike: []
  };
  progress = 0;

  groupOptions: any[] = [
    { name: 'Wandern', value: 1 },
    { name: 'Wandern und Laufen', value: 2 },
    { name: 'Wandern, Laufen und Rad', value: 3 }
  ];

  selectedGroup: number = 0;

  constructor(
    private umService: UmServiceService,
    private dP: DomParserService
  ) {
  }

  ngOnInit() {

  }

  groupSelect(id: number) {
    this.getDataForGroup(id)
  }

  selectUser(userId: string | undefined): void {
    if(userId !== undefined){
      this.findUser(userId);
      this.progress = Math.round((100 / this.selectedUser?.gemeldet! * this.selectedUser?.bereitsZurueckgelegt!) * 100 ) / 100
      console.log(this.progress)
      this.getData()
    }

  }

  findUser(userId: string) {
    const HikeUser = this.allUsers.hike.find(user => user.name === userId)
    const HikeRunUser = this.allUsers.hikeRun.find(user => user.name === userId)
    const HikeRunBikeUser = this.allUsers.hikeRunBike.find(user => user.name === userId)
    if(HikeUser) {
      this.selectedUser = HikeUser;
      this.selectedUserGroup = 'Wandern';
    } else if(HikeRunUser) {
      this.selectedUser = HikeRunUser;
      this.selectedUserGroup = 'Wandern und Laufen';
    } else if(HikeRunBikeUser) {
      this.selectedUser = HikeRunBikeUser;
      this.selectedUserGroup = 'Wandern, Laufen und Radfahren';
    }
  }

  getData() {
    this.umService.getQuartalDataHike().subscribe(response => {
      this.allUsers.hike = this.dP.convertHtmlToObject(response);
      this.umService.getQuartalDataHikeRun().subscribe(response => {
        this.allUsers.hikeRun = this.dP.convertHtmlToObject(response);
        this.umService.getQuartalDataHikeRunBike().subscribe(response => {
          this.allUsers.hikeRunBike = this.dP.convertHtmlToObject(response);
          this.isLoading = false;
        })
      })
    })




  }
  getDataForGroup(id: number) {
    switch (id) {
      case 1:
        this.umService.getQuartalDataHike().subscribe(response => {
          this.allUsers.hike = this.dP.convertHtmlToObject(response);
          this.isLoading = false;
        })
        break;
        case 2:
          this.umService.getQuartalDataHikeRun().subscribe(response => {
            this.allUsers.hikeRun = this.dP.convertHtmlToObject(response);
            this.isLoading = false;
          })
        break;
          case 3:
            this.umService.getQuartalDataHikeRunBike().subscribe(response => {
              this.allUsers.hikeRunBike = this.dP.convertHtmlToObject(response);
              this.isLoading = false;
            })
    }
  }


}
