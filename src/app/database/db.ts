import Dexie from 'dexie';
import {Participant} from '../interfaces/participant';

export class ParticipantDB extends Dexie {

  participantsHike!: Dexie.Table<Participant, string>;
  participantsHikeRun!: Dexie.Table<Participant, string>;
  participantsHikeRunBike!: Dexie.Table<Participant, string>;

  constructor() {
    super('UltramarschDB');
    this.version(1).stores({
      participantsHike: 'name',
      participantsHikeRun: 'name',
      participantsHikeRunBike: 'name'
    });
  }
}

export const db = new ParticipantDB();

