import { Injectable } from '@angular/core';
import {Participant} from '../interfaces/participant';
import {
  ExtractedMessages,
  ProcessedMessage,
  ToBeProofedMessage
} from '../interfaces/processed-messages';

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
      const tagesdurchschnittRad = getTagesDurchschnitt("Tagesdurchschnitt per Rad");

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
        tagesdurchschnittRad: tagesdurchschnittRad ?? undefined,
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
      const tagesdurchschnittRad = getTagesDurchschnitt("Tagesdurchschnitt per Rad");

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
        tagesdurchschnittRad: tagesdurchschnittRad ?? undefined,
        letzteMeldung
      });
    }
    console.log(participants);
    return participants;
  }

  /** kleine Helpers */
  extractNumber(regex: RegExp, text: string): number {
    const m = text.match(regex);
    if (!m) return 0;
    // Komma/ Punkt-Varianten abfangen
    const norm = m[1].replace(/\./g, "").replace(",", ".");
    const val = parseFloat(norm);
    return Number.isFinite(val) ? val : 0;
  }
  extractString(regex: RegExp, text: string): string {
    const m = text.match(regex);
    return m ? m[1].trim() : "";
  }

  getSectionBodyByHeading(doc: Document, headingText: string): HTMLTableSectionElement | null {
    // findet das THEAD mit der Überschrift und nimmt das direkt folgende TBODY
    const theads = Array.from(doc.querySelectorAll<HTMLTableSectionElement>("table.table thead"));
    const thead = theads.find(th => th.textContent?.includes(headingText)) || null;
    if (!thead) return null;
    const body = thead.nextElementSibling;
    return body && body.tagName === "TBODY" ? (body as HTMLTableSectionElement) : null;
  }

  parseRowCommon(row: HTMLTableRowElement) {
    const imgUrl = (row.querySelector("img") as HTMLImageElement | null)?.src || "";
    const tds = row.querySelectorAll<HTMLTableCellElement>("td");
    const infoText = (tds[1]?.textContent || "").trim();             // enthält Länge/Höhe/Datum
    const noteSpan = tds[2]?.querySelector("span");
    const noteCount = noteSpan ? parseInt(noteSpan.textContent?.trim() || "0", 10) : 0;

    const date = this.extractString(/Datum:\s*([\d]{4}-[\d]{2}-[\d]{2})/i, infoText);
    const length = this.extractNumber(/Länge:\s*([\d.,]+)/i, infoText);
    const height = this.extractNumber(/Höhe:\s*([\d.,]+)/i, infoText);
    const bikeLength = this.extractNumber(/Länge\s*Bike:\s*([\d.,]+)/i, infoText);
    const bikeHeight = this.extractNumber(/Höhe\s*Bike:\s*([\d.,]+)/i, infoText);
    const status = this.extractString(/Status:\s*([^\n\r<]+)/i, infoText) || undefined;

    return { imgUrl, infoText, noteCount, date, length, height, bikeLength, bikeHeight, status, tds };
  }

  /** Hauptfunktion: parst beide Abschnitte */
  extractAllMessages(response: string): ExtractedMessages {
    const parser = new DOMParser();
    const doc = parser.parseFromString(response, "text/html");

    const processedMessages: ProcessedMessage[] = [];
    const toBeProofed: ToBeProofedMessage[] = [];

    // --- Abschnitt A: "Diese Meldungen haben wir verarbeitet"
    const processedBody = this.getSectionBodyByHeading(doc, "Diese Meldungen haben wir verarbeitet");
    if (processedBody) {
      const rows = Array.from(processedBody.querySelectorAll<HTMLTableRowElement>("tr"));
      for (const row of rows) {
        const { imgUrl, infoText, noteCount, date, length, height, bikeLength, bikeHeight } = this.parseRowCommon(row);
        // ID steht hier explizit im Text
        const idStr = this.extractString(/ID:\s*(\d+)/i, infoText);
        if (!idStr || !date) continue;
        processedMessages.push({
          id: parseInt(idStr, 10),
          date,
          length,
          height,
          bikeLength,
          bikeHeight,
          imageUrl: imgUrl,
          noteCount,
        });
      }
    }

    // --- Abschnitt B: "Diese Meldungen prüfen wir gerade"
    const proofBody = this.getSectionBodyByHeading(doc, "Diese Meldungen prüfen wir gerade");
    if (proofBody) {
      const rows = Array.from(proofBody.querySelectorAll<HTMLTableRowElement>("tr"));
      for (const row of rows) {
        const {
          imgUrl, noteCount, date, length, height, bikeLength, bikeHeight, status, tds,
        } = this.parseRowCommon(row);

        // ID ist hier NICHT im Infotext – wir holen sie aus data-meldung-id (Icon)
        let idStr =
          (tds[2]?.querySelector<HTMLElement>(".myNotiz")?.getAttribute("data-meldung-id")) ||
          // Fallback: id aus dem Lösch-Link /meldung/delete/?...&id=205123
          this.extractString(/id=(\d+)/i, (tds[3]?.querySelector("a") as HTMLAnchorElement | null)?.href || "");

        if (!idStr) continue;
        toBeProofed.push({
          id: parseInt(idStr, 10),
          date,
          length,
          height,
          bikeLength,
          bikeHeight,
          imageUrl: imgUrl,
          noteCount,
          status,
        });
      }
    }

    return { processedMessages, toBeProofed };
  }

  /** Optional: Beibehaltung deiner bisherigen Signatur */
  extractProcessedMessages(response: string): ExtractedMessages {
    return this.extractAllMessages(response);
  }


  }
