import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { EventoService } from './../_services/evento.service';
import { Evento } from '../_models/Evento';



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
  registerForm: FormGroup;

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

  // Formulario reativo
  validation() {
    this.registerForm = new FormGroup({
      local: new FormControl,
      dataEvento: new FormControl,
      imagemURL: new FormControl,
      qtdPessoas: new FormControl,
      telefone: new FormControl,
      email: new FormControl

    });
  }

  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  salvarAlteracao(){

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
