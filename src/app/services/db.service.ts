import { Injectable } from '@angular/core';
import {Participant} from '../interfaces/participant';
import {db} from '../database/db';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor() { }

  async addParticipantHike(participant: Participant[]) {
    return db.participantsHike.bulkPut(participant);
  }

  async addParticipantHikeRun(participant: Participant[]) {
    return db.participantsHikeRun.bulkPut(participant);
  }

  async addParticipantHikeRunBike(participant: Participant[]) {
    return db.participantsHikeRunBike.bulkPut(participant);
  }

  async getParticipantsHike() {
    return db.participantsHike.toArray();
  }

  async getParticipantsHikeRun() {
    return db.participantsHikeRun.toArray();
  }

  async getParticipantsHikeRunBike() {
    return db.participantsHikeRunBike.toArray();
  }
}
