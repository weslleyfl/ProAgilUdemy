import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  evento: any = [
    {
      EventoId : 1,
      Tema : 'Teste Tema',
      Local : 'Contagem'
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
