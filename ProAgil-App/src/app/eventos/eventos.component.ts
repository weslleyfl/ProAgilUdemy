import { Component, OnInit } from '@angular/core';
import { EventoService } from './../_services/evento.service';


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  private _filtroLista: string;
  eventosFiltrados: any = [];
  eventos: any = [];
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;


  constructor(private eventoService: EventoService) { }

  ngOnInit() {
    this.GetEventos();
  }

  get filtroLista() {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }


  filtrarEventos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLocaleLowerCase();

    return this.eventos.filter(evento => {
      return evento.tema.toLocaleLowerCase().includes(filtrarPor)
    });
    // return this.eventos.filter(
    //     evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    // );
  }


  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }


  public GetEventos() {
    this.eventoService.getEvento().subscribe((response) => {
      this.eventos = response;
      this.eventosFiltrados = this.eventos;
    }, error => {
      console.log(error);
    });

  }

  // public GetEventos() {
  //    this.http.get('http://localhost:5000/api/values').subscribe( (response) => {
  //        this.eventos = response;
  //     }, error => {
  //       console.log(error);
  //     });

  // }

}
