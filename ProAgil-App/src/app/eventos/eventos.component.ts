import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { defineLocale, BsLocaleService, ptBrLocale } from 'ngx-bootstrap';

import { EventoService } from './../_services/evento.service';
import { Evento } from '../_models/Evento';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  _filtroLista: string;
  eventosFiltrados: Evento[];
  eventos: Evento[];
  evento: Evento;
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  modoSalvar = 'post';
  bodyDeletarEvento = '';
  // modalRef: BsModalRef;
  registerForm: FormGroup;

  constructor(
    private eventoService: EventoService
    , private modalService: BsModalService
    , private fb: FormBuilder
    , private localeService: BsLocaleService

  ) {

    this.localeService.use('pt-br');
  }

  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  get filtroLista() {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
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
  // this.registerForm = new FormGroup({
  validation() {

    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      imagemURL: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]

    });
  }

  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  salvarAlteracao(template: any) {

    if (this.registerForm.valid) {

      if (this.modoSalvar === 'post') {

        // pego os valors do formulario
        this.evento = Object.assign({}, this.registerForm.value);

        // this.uploadImagem();

        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
            template.hide();
            this.getEventos();
            // this.toastr.success('Inserido com Sucesso!');
          }, error => {
            // this.toastr.error(`Erro ao Inserir: ${error}`);
          }
        );

      } else { // put

        // pego os valors do formulario
        this.evento = Object.assign({ id: this.evento.id }, this.registerForm.value);

        // this.uploadImagem();
        // console.log('Editar ', this.registerForm.value);
        // console.log('Evento ', this.evento);

        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
            // this.toastr.success('Editado com Sucesso!');
          }, error => {
            // this.toastr.error(`Erro ao Editar: ${error}`);
          }
        );
      }
    }
  }

  editarEvento(evento: Evento, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = evento;
    this.registerForm.patchValue(evento);

  }

  novoEvento(template: any) {
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
        template.hide();
        this.getEventos();
        // this.toastr.success('Deletado com Sucesso');
      }, error => {
        // this.toastr.error('Erro ao tentar Deletar');
        console.log(error);
      }
    );
  }

  openModal(template: any) {
    // this.modalRef = this.modalService.show(template);
    this.registerForm.reset();
    template.show();
  }


  public getEventos() {
    this.eventoService.getAllEvento().subscribe((_eventos: Evento[]) => {
      this.eventos = _eventos;
      this.eventosFiltrados = this.eventos;
      // console.log(_eventos);
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
