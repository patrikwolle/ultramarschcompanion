import { Injectable } from '@angular/core';
import {Participant} from '../interfaces/participant';

@Injectable({
  providedIn: 'root'
})
export class DomParserService {

  constructor() { }

  convertRadHtmlToObject(html: any): any {
    const match = html.match(/\({'result'\s*:\s*'(.*)'}\)/s);
    if (!match || match.length < 2) throw new Error("Fehler beim Parsen");

    const htmlString = match[1].replace(/\\'/g, "'").replace(/&quot;/g, '"');

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    const rows = Array.from(doc.querySelectorAll("tr"));

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
      const rowText = row.textContent?.trim();
      if (!rowText || !rowText.includes("gemeldete Distanz")) continue;

      const nameMatch = row.innerHTML.match(/<b>(.*?)<\/b>/);
      const name = nameMatch ? nameMatch[1].trim() : undefined;

      const getVal = (label: string): number => {
        const regex = new RegExp(`${label}:\\s*([\\d.,]+)\\s*Kilometer`, "i");
        const match = rowText.match(regex);
        return match ? parseFloat(match[1].replace(",", ".")) : 0;
      };

      const getTagesDurchschnitt = (label: string): number | undefined => {
        const regex = new RegExp(`${label}:\\s*([\\d.,]+)\\s*Kilometer`, "i");
        const match = rowText.match(regex);
        return match ? parseFloat(match[1].replace(",", ".")) : 0;
      };

      const gemeldet = getVal("gemeldete Distanz");
      const fuss = getVal("Bereits zurückgelegte Distanz zu Fuß");
      const rad = getVal("Bereits zurückgelegte Distanz per Rad");
      const jahr = getVal("Bereits zurückgelegte seit Jahresbeginn");

      const tagesdurchschnitt = getTagesDurchschnitt("Tagesdurchschnitt zu Fuß");

      let letzteMeldung: Participant["letzteMeldung"] = undefined;
      const meldungMatch = rowText.match(/letzte Meldung vom\s+(\d{2}\.\d{2}\.\d{4}):?\s*([\d.,]+)?\s*Kilometer/i);
      if (meldungMatch) {
        const distanz = parseFloat((meldungMatch[2] || "0").replace(",", "."));
        letzteMeldung = {
          datum: meldungMatch[1],
          distanz: distanz
        };
      }

      const imgEl = row.querySelector("img");
      const image = imgEl?.getAttribute("src") ?? "";

      const bereitsZurueckgelegt = fuss !== undefined && rad !== undefined ? fuss + rad : fuss ?? rad;

      participants.push({
        name,
        image,
        gemeldet,
        bereitsZurueckgelegt,
        jahr,
        tagesdurchschnitt: tagesdurchschnitt ?? undefined,
        letzteMeldung
      });
    }
    console.log(participants);
    return participants;
  }

  convertHtmlToObject(html: any): any {
    const match = html.match(/\({'result'\s*:\s*'(.*)'}\)/s);
    if (!match || match.length < 2) throw new Error("Fehler beim Parsen");

    const htmlString = match[1].replace(/\\'/g, "'").replace(/&quot;/g, '"');

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    const rows = Array.from(doc.querySelectorAll("tr"));

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
      const rowText = row.textContent?.trim();
      if (!rowText || !rowText.includes("gemeldete Distanz")) continue;

      const nameMatch = row.innerHTML.match(/<b>(.*?)<\/b>/);
      const name = nameMatch ? nameMatch[1].trim() : undefined;

      const getVal = (label: string): number => {
        const regex = new RegExp(`${label}:\\s*([\\d.,]+)\\s*Kilometer`, "i");
        const match = rowText.match(regex);
        return match ? parseFloat(match[1].replace(",", ".")) : 0;
      };

      const getTagesDurchschnitt = (label: string): number | undefined => {
        const regex = new RegExp(`${label}:\\s*([\\d.,]+)\\s*Kilometer`, "i");
        const match = rowText.match(regex);
        return match ? parseFloat(match[1].replace(",", ".")) : 0;
      };

      const gemeldet = getVal("gemeldete Distanz");
      const fuss = getVal("Bereits zurückgelegte Distanz");
      const rad = 0;
      const jahr = getVal("Bereits zurückgelegte seit Jahresbeginn");

      const tagesdurchschnitt = getTagesDurchschnitt("Tagesdurchschnitt");

      let letzteMeldung: Participant["letzteMeldung"] = undefined;
      const meldungMatch = rowText.match(/letzte Meldung vom\s+(\d{2}\.\d{2}\.\d{4}):?\s*([\d.,]+)?\s*Kilometer/i);
      if (meldungMatch) {
        const distanz = parseFloat((meldungMatch[2] || "0").replace(",", "."));
        letzteMeldung = {
          datum: meldungMatch[1],
          distanz: distanz
        };
      }

      // ➕ NEU: Bild extrahieren
      const imgEl = row.querySelector("img");
      const image = imgEl?.getAttribute("src") ?? "";

      const bereitsZurueckgelegt = fuss !== undefined && rad !== undefined ? fuss + rad : fuss ?? rad;

      participants.push({
        name,
        image, // <-- hier eingefügt
        gemeldet,
        bereitsZurueckgelegt,
        jahr,
        tagesdurchschnitt: tagesdurchschnitt ?? undefined,
        letzteMeldung
      });
    }
    console.log(participants);
    return participants;
  }


  }
