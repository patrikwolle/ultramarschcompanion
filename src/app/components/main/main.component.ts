import {Component, OnInit} from '@angular/core';
import {UmServiceService} from '../../services/um-service.service';
import {DomParserService} from '../../services/dom-parser.service';
import {AllParticipant, Participant} from '../../interfaces/participant';
import {LocalStorageService} from '../../services/local-storage.service';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {GroupSelectDialogComponent} from '../../dialogs/group-select-dialog/group-select-dialog.component';
import {DbService} from '../../services/db.service';
import {MenuItem, MenuItemCommandEvent} from 'primeng/api';
import {SettingsComponent} from '../../dialogs/settings/settings.component';
import {ProcessedMessages} from '../../interfaces/processed-messages';
import {UtilsService} from '../../services/utils.service';
import {UploadDialogComponent} from '../../dialogs/upload-dialog/upload-dialog.component';

@Component({
  selector: 'um-main',
  standalone: false,
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  providers: [DialogService]
})
export class MainComponent implements OnInit {

  isLoading = true;
  isLoadingAll = true;

  selectUserId: string | undefined;
  selectedUser: Participant | undefined;
  selectedUserGroup: string = '';
  friendId: string = '';
  friends: Participant[] = []
  history: ProcessedMessages[] =[];
  showHistory: boolean = false;

  ref: DynamicDialogRef | undefined;

  menuItems: MenuItem[] = [
    {
      label: 'Settings',
    },
    {
      label: 'Upload'
    }
  ]

  quartale = [
    {
      name: 'q1',
      start: new Date(20)
    }
  ]

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
  self = this;
  token: string = '';

  constructor(
    private umService: UmServiceService,
    private dP: DomParserService,
    private database: DbService,
    private lS: LocalStorageService,
    public dialogService: DialogService,
    protected utils: UtilsService
  ) {
  }

  ngOnInit() {
    const self = this;
    this.token = this.lS.getToken();
    if(this.token !== '') {
      this.umService.getProcessedMessages(this.token).subscribe(res => {
          this.history = this.dP.extractProcessedMessages(res);
        }
      )

    }

    this.selectedUserGroup = typeof this.lS.getCategory() === 'string' &&  this.lS.getCategory() !== null ?  this.lS.getCategory()!  : '';
    this.selectedGroup = this.groupOptions.find(group => group.name === this.selectedUserGroup)?.value || 0;
    this.selectUserId = this.lS.getUser() !== null ? this.lS.getUser()! : undefined;
    this.menuItems = [
      {
        label: 'Settings',
        command(event: MenuItemCommandEvent) {
          self.dialogService.open(SettingsComponent,
            {
              header: 'Einstellungen',
              width: '50vw',
              modal: true,
              breakpoints: {
                '960px': '75vw',
                '640px': '100vw'
              }
            })
        }
      },
      {
        label: 'Upload',
        command(event: MenuItemCommandEvent) {
          self.dialogService.open(UploadDialogComponent,
            {
              header: 'Upload',
              width: '50vw',
              modal: true,
              breakpoints: {
                '960px': '75vw',
                '640px': '100vw'
              }
            })
        }
      }
    ]
    this.database.getParticipantsHike().then((participants) => {
      this.allUsers.hike = participants
      this.database.getParticipantsHikeRun().then((participants) => {
        this.allUsers.hikeRun = participants
        this.database.getParticipantsHikeRunBike().then((participants) => {
          this.allUsers.hikeRunBike = participants
          this.selectedUser = this.findUser(this.selectUserId!);
          this.isLoadingAll = false;
          this.lS.getFriends().forEach(friendId => {
            this.addFriend(friendId)
          })
        })
      })
    })
    if(this.selectedGroup !== 0) {
      this.groupSelect(this.selectedGroup)
    } else {
      this.ref = this.dialogService.open(GroupSelectDialogComponent,
        {
          header: 'Gruppe auswählen',
          width: '50vw',
          modal: true,
          breakpoints: {
            '960px': '75vw',
            '640px': '100vw'
          }
        }
      )
      this.ref.onClose.subscribe(result => {
        if(result !== undefined) {
          this.groupSelect(result)
        }
      })

    }
  }

  groupSelect(id: number) {
    this.getDataForGroup(id)
    this.lS.addCatergory(this.groupOptions.find(group => group.value === id)?.name)
  }

  addFriend(friendId: string) {
    const friend = this.findUser(friendId);
    if(friend) {
      this.friends.push(friend)
      this.lS.addFriend(friendId)
    }
    this.friendId = '';
  }

  updateFriend(friendId: string) {
    const friend = this.findUser(friendId);
    if(friend) {
      this.friends = this.friends.map(f => f.name === friendId ? friend : f)
    }
  }

  removeFriend(friendId: string) {
    this.friends = this.friends.filter(f => f.name !== friendId);
    this.lS.removeFriend(friendId)
  }

  selectUser(userId: string | undefined): void {
    if(userId !== undefined){
      console.log(userId)
      this.lS.addUser(userId)
      this.selectedUser = this.findUser(userId);
      this.progress = Math.round((100 / this.selectedUser?.gemeldet! * this.selectedUser?.bereitsZurueckgelegt!) * 100 ) / 100
      console.log(this.progress)
      this.getData()
    }

  }

  findUser(userId: string): Participant | undefined {
    console.log(userId)
    const HikeUser = this.allUsers.hike.find(user => user.name === userId)
    const HikeRunUser = this.allUsers.hikeRun.find(user => user.name === userId)
    const HikeRunBikeUser = this.allUsers.hikeRunBike.find(user => user.name === userId)
    if(HikeUser) {
      this.selectedUserGroup = 'Wandern';
      return HikeUser;
    } else if(HikeRunUser) {
      this.selectedUserGroup = 'Wandern und Laufen';
      return HikeRunUser;

    } else if(HikeRunBikeUser) {
      this.selectedUserGroup = 'Wandern, Laufen und Radfahren';
      return HikeRunBikeUser;
    } else {
      return undefined;
    }
  }

  getData() {
    switch (this.selectedUserGroup) {
      case 'Wandern':
        this.umService.getQuartalDataHikeRun().subscribe(response => {
          this.allUsers.hikeRun = this.dP.convertHtmlToObject(response);
          this.database.addParticipantHike(this.allUsers.hike).then(() => {})
          this.umService.getQuartalDataHikeRunBike().subscribe(response => {
            this.allUsers.hikeRunBike = this.dP.convertRadHtmlToObject(response);
            this.database.addParticipantHikeRunBike(this.allUsers.hikeRunBike).then(() => {
              this.lS.getFriends().forEach(friendId => {
                this.updateFriend(friendId)
              })
            })
          })
        })
        break;
      case 'Wandern und Laufen':
        this.umService.getQuartalDataHike().subscribe(response => {
          this.allUsers.hike = this.dP.convertHtmlToObject(response);
          this.database.addParticipantHike(this.allUsers.hike).then(() => {})
          this.umService.getQuartalDataHikeRunBike().subscribe(response => {
            this.allUsers.hikeRunBike = this.dP.convertRadHtmlToObject(response);
            this.database.addParticipantHikeRunBike(this.allUsers.hikeRunBike).then(() => {
              this.lS.getFriends().forEach(friendId => {
                this.updateFriend(friendId)
              })
            })
          })
        })
        break;
      case 'Wandern, Laufen und Radfahren':
        this.umService.getQuartalDataHike().subscribe(response => {
          this.allUsers.hike = this.dP.convertHtmlToObject(response);
          this.database.addParticipantHike(this.allUsers.hike).then(() => {})
          this.umService.getQuartalDataHikeRun().subscribe(response => {
            this.allUsers.hikeRun = this.dP.convertHtmlToObject(response);
            this.database.addParticipantHikeRun(this.allUsers.hikeRun).then(() => {
              this.lS.getFriends().forEach(friendId => {
                this.updateFriend(friendId)
              })
            })
          })
        })
    }
  }
  getDataForGroup(id: number) {
    switch (id) {
      case 1:
        this.umService.getQuartalDataHike().subscribe(response => {
          this.allUsers.hike = this.dP.convertHtmlToObject(response);
          this.database.addParticipantHike(this.allUsers.hike).then(() => {})
          this.isLoading = false;
          if(this.selectUserId) {
            this.selectUser(this.selectUserId)
          }
        })
        break;
        case 2:
          this.umService.getQuartalDataHikeRun().subscribe(response => {
            this.allUsers.hikeRun = this.dP.convertHtmlToObject(response);
            this.database.addParticipantHikeRun(this.allUsers.hikeRun).then(() => {})
            this.isLoading = false;
            if(this.selectUserId) {
              this.selectUser(this.selectUserId)
            }
          })
        break;
          case 3:
            this.umService.getQuartalDataHikeRunBike().subscribe(response => {
              this.allUsers.hikeRunBike = this.dP.convertRadHtmlToObject(response);
              this.database.addParticipantHikeRunBike(this.allUsers.hikeRunBike).then(() => {})
              this.isLoading = false;
              if(this.selectUserId) {
                this.selectUser(this.selectUserId)
              }
            })
    }



  }



  toogleHistory() {
    this.showHistory = !this.showHistory;
  }





}
