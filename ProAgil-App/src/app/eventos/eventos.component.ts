import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  evento: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

public GetEventos(){
   this.http.get('http://localhost:5000/api/values').subscribe( response => {
    this.evento = response;
    }, error => {
      console.log(error);
    });

}


}
