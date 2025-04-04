import { Injectable } from '@angular/core';
import {Participant} from '../interfaces/participant';

@Injectable({
  providedIn: 'root'
})
export class DomParserService {

  constructor() { }

  convertHtmlToObject(html: any): any {
    const match = html.match(/\({'result'\s*:\s*'(.*)'}\)/s);
    if (!match || match.length < 2) throw new Error("Fehler beim Parsen");

    const htmlString = match[1].replace(/\\'/g, "'").replace(/&quot;/g, '"');

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    console.log(doc);

    const rows = Array.from(doc.querySelectorAll("tr"));
    console.log(rows);

    const parseKm = (input: string | undefined): number | undefined => {
      if (!input) return undefined;
      const match = input.match(/([\d.,]+)/);
      return match ? parseFloat(match[1].replace(",", ".")) : undefined;
    };

    const parseDurchschnitt = (input: string | undefined): number | undefined => {
      if (!input) return undefined;
      const match = input.match(/([\d.,]+)/);
      return match ? parseFloat(match[1].replace(",", ".")) : undefined;
    };

    const participants: Participant[] = [];

    for (const row of rows) {
      const infoTags = Array.from(row.querySelectorAll("b"));
      if (infoTags.length < 5) continue; // Überspringe irrelevante Zeilen

      const name = infoTags[0]?.textContent?.trim();
      const gemeldet = parseKm(infoTags[1]?.textContent!);
      const bereitsZurueckgelegt = parseKm(infoTags[2]?.textContent!);
      const jahr = parseKm(infoTags[3]?.textContent!);
      const tagesdurchschnitt = parseDurchschnitt(infoTags[4]?.textContent!);

      const rawText = row.textContent || "";
      const letzteMeldungMatch = rawText.match(
        /letzte Meldung vom\s+(\d{2}\.\d{2}\.\d{4})[^0-9]*([\d.,]+)\s+Kilometer/i
      );

      let letzteMeldung: Participant["letzteMeldung"] = undefined;
      if (letzteMeldungMatch) {
        letzteMeldung = {
          datum: letzteMeldungMatch[1],
          distanz: parseFloat(letzteMeldungMatch[2].replace(",", ".")),
        };
      }

      participants.push({
        name,
        gemeldet,
        bereitsZurueckgelegt,
        jahr,
        tagesdurchschnitt,
        letzteMeldung,
      });
    }

    return participants;
  }

}
