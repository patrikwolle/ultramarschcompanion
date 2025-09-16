export interface Participant {
  name: string | undefined;
  image: string | undefined;
  gemeldet: number | undefined; // z. B. "1000 Kilometer"
  bereitsZurueckgelegt: number | undefined; // z. B. "50,50 Kilometer"
  jahr: number | undefined; // z. B. "556,44 Kilometer"
  tagesdurchschnitt: number | undefined; // z. B. "16,83"
  tagesdurchschnittRad: number | undefined;
  letzteMeldung: { datum: string; distanz: number } | undefined; // z. B. ["letzte Meldung vom...", "Datum", "Kilometer"]
}

export interface AllParticipant {
  hike: Participant[];
  hikeRun: Participant[];
  hikeRunBike: Participant[];
}
