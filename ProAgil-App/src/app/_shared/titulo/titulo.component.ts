import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.css']
})
export class TituloComponent implements OnInit {

  @Input() titulo: string; // Vai ser recebido de fora do componente pai

  // title = 'ProAgil-App';

  constructor() { }

  ngOnInit() {
  }

}
