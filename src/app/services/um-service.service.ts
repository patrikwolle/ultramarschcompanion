import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UmServiceService {

  constructor(
    private http: HttpClient
  ) { }

  getQuartalDataHike() {
    return this.http.get('https://ultramarsch-connector-production.up.railway.app/ultramarsch/?event=369,370,371,372', { responseType: 'text' });
    //return this.http.get('https://ultramarsch-connector-production.up.railway.app/ultramarsch/?event=357,358,359,360', { responseType: 'text' });
    //return this.http.jsonp('https://list.ultramarsch.de/result/table/?event=357,358,359,360&callback=jQuery1810512256588940176_1743666439151&_=1743666439208', 'callback')
  }

  getQuartalDataHikeRun() {
    return this.http.get('https://ultramarsch-connector-production.up.railway.app/ultramarsch/?event=373,374,375,376', { responseType: 'text' });
    //return this.http.get('https://ultramarsch-connector-production.up.railway.app/ultramarsch/?event=361,362,363,364', { responseType: 'text' });
    //return this.http.jsonp('https://list.ultramarsch.de/result/table/?event=357,358,359,360&callback=jQuery1810512256588940176_1743666439151&_=1743666439208', 'callback')
  }

  getQuartalDataHikeRunBike() {
    return this.http.get('https://ultramarsch-connector-production.up.railway.app/ultramarsch/?event=377,378,379,380&bike=1', { responseType: 'text'});
    //return this.http.get('https://ultramarsch-connector-production.up.railway.app/ultramarsch/?event=365,366,367,368&bike=1', { responseType: 'text'});
    //return this.http.jsonp('https://list.ultramarsch.de/result/table/?event=357,358,359,360&callback=jQuery1810512256588940176_1743666439151&_=1743666439208', 'callback')
  }

  getProcessedMessages(token: string) {
    return this.http.get(`https://ultramarsch-connector-production.up.railway.app/melden/?token=${token}`,{ responseType: 'text'})
  }

  postData(formData: FormData) {
    return this.http.post('https://ultramarsch-connector-production.up.railway.app/melden/save', formData, { responseType: 'text', withCredentials: true })
  }
}
