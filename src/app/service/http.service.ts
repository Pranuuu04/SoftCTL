import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(public httpClient : HttpClient) { }

  post(url: string,request: any){
    return new Promise<any>(resolve => {
        this.httpClient.post(url, request, {}).subscribe((data: any) => {
        resolve(data);
      }, (err: any) => {
        resolve(err);
      });
    });
  }

  get(url: string) {
    return new Promise<any>(resolve => {
      this.httpClient.get(url, {params: {},headers: {}}).subscribe((data: any) => {
          resolve(data);
        }, (err: any) => {
          resolve(err);
        });
    });
  }

  delete(url: string) {
    return new Promise<any>(resolve => {
      this.httpClient.delete(url, {params: {},headers: {}}).subscribe((data: any) => {
          resolve(data);
        }, (err: any) => {
          resolve(err);
        });
    });
  }

  async convertImageToBase64(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.open('GET', imageUrl);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }

}
