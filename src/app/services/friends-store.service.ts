import { Injectable } from "@angular/core";
import { Friend } from "../models/friends";

const LS_KEY = "um.friends";

@Injectable({ providedIn: "root" })
export class FriendStoreService {
  list(): Friend[] {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  saveAll(friends: Friend[]): void {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(friends));
    } catch {
      // noop
    }
  }

  add(friend: Friend): Friend[] {
    const all = this.list();
    all.push(friend);
    this.saveAll(all);
    return all;
  }

  existsByName(name: string): boolean {
    const needle = name.trim().toLowerCase();
    return this.list().some(
      (f) => (f.name || "").trim().toLowerCase() === needle
    );
  }
}
