import { Injectable } from '@angular/core';
import {Participant} from '../interfaces/participant';
import {ProcessedMessages} from '../interfaces/processed-messages';

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

  extractProcessedMessages(response: string): ProcessedMessages[] {

    console.log(response)

    const parser = new DOMParser();
    const doc = parser.parseFromString(response, "text/html");

// 2. Tabelle im neuen DOM suchen
    const tableElement = doc.querySelector("table.table") as HTMLElement;
    console.log(tableElement)
    const processedMessages: ProcessedMessages[] = [];

    let inProcessedSection = false;
    const rows = Array.from(tableElement.querySelectorAll("tbody tr"));
    console.log(rows)

    for (const row of rows) {
      // Prüfen, ob die Überschrift „haben wir verarbeitet“ direkt VOR diesem <tr> steht
      const prev = row.previousElementSibling;

      // Jetzt sind wir in der verarbeiteten Sektion, also Inhalte auslesen
      const imgElem = row.querySelector("img") as HTMLImageElement | null;
      const columns = row.querySelectorAll("td");
      if (columns.length < 3) continue; // Sicherheit: mindestens 3 Spalten erwarten

      const infoHtml = columns[1].innerHTML;
      const noteSpan = columns[2].querySelector("span");
      const noteCount = noteSpan
        ? parseInt(noteSpan.textContent?.trim() || "0", 10)
        : 0;

      // Per Regex ID, Datum, Maße aus dem innerHTML extrahieren
      const idMatch = infoHtml.match(/ID:\s*(\d+)/);
      const dateMatch = infoHtml.match(/Datum:\s*([\d\-]+)/);
      const lengthMatch = infoHtml.match(/Länge:\s*([\d.]+)/);
      const heightMatch = infoHtml.match(/Höhe:\s*([\d.]+)/);
      const bikeLengthMatch = infoHtml.match(/Länge Bike:\s*([\d.]+)/);
      const bikeHeightMatch = infoHtml.match(/Höhe Bike:\s*([\d.]+)/);


      if (idMatch && dateMatch) {
        processedMessages.push({
          id: parseInt(idMatch[1], 10),
          date: dateMatch[1],
          length: lengthMatch ? parseFloat(lengthMatch[1]) : 0,
          height: heightMatch ? parseFloat(heightMatch[1]) : 0,
          bikeLength: bikeLengthMatch ? parseFloat(bikeLengthMatch[1]) : 0,
          bikeHeight: bikeHeightMatch ? parseFloat(bikeHeightMatch[1]) : 0,
          imageUrl: imgElem?.src || "",
          noteCount: noteCount,
        });
      }
    }

    return processedMessages;
  }


  }
