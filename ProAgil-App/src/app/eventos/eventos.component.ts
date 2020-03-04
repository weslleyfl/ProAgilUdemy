import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from './../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  _filtroLista: string;
  eventosFiltrados: Evento[];
  eventos: Evento[];
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  modalRef: BsModalRef;

  constructor(
    private eventoService: EventoService
    , private modalService: BsModalService
  ) { }

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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();

    return this.eventos.filter(evento => {
      return evento.tema.toLocaleLowerCase().includes(filtrarPor);
    });

    // return this.eventos.filter(
    //     evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    // );
  }


  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }


  public GetEventos() {
    this.eventoService.getAllEvento().subscribe((_eventos: Evento[]) => {
      this.eventos = _eventos;
      this.eventosFiltrados = this.eventos;
      console.log(_eventos);
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
