import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../_models/Evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  baseURL = 'http://localhost:5000/api/evento';

  constructor(private http: HttpClient) { }
  getAllEvento(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseURL);
  }
  getEventoByTema(tema: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseURL}/getByTema/${tema}`);
  }
  getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseURL}/${id}`);
  }

  postEvento(evento: Evento) {
    return this.http.post(this.baseURL, evento);
  }

  postUpload(file: File, name: string) {

    const fileUpload = <File>file[0];
    const formData = new FormData();
    formData.append('file', fileUpload, name);
    return this.http.post(`${this.baseURL}/upload`, formData);
  }

  putEvento(evento: Evento) {
    // console.log('Editar ', evento.dataEvento);
    return this.http.put(`${this.baseURL}/${evento.id}`, evento);
  }

  deleteEvento(id: number) {
    return this.http.delete(`${this.baseURL}/${id}`);
  }

}
