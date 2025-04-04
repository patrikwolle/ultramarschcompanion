import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  addCatergory(category: string) {
    localStorage.setItem('category', category);
  }

  getCategory() {
    return localStorage.getItem('category');
  }

  addUser(user: string) {
    localStorage.setItem('user', user);
  }

  getUser() {
    return localStorage.getItem('user');
  }

  addFriend(friend: string) {
    let friends: string[] = localStorage.getItem('friends')?.split(',') || [];
    if(friends.includes(friend)) return;
    friends.push(friend);
    localStorage.setItem('friends', friends.join(','));
  }

  getFriends() {
    return localStorage.getItem('friends')?.split(',') || [];
  }

  removeFriend(friend: string) {
    let friends: string[] = localStorage.getItem('friends')?.split(',') || [];
    friends = friends.filter(f => f !== friend);
    localStorage.setItem('friends', friends.join(','));
  }
}
