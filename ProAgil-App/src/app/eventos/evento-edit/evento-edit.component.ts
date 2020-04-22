import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { EventoService } from 'src/app/_services/evento.service';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Evento } from './../../_models/Evento';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-evento-edit',
  templateUrl: './evento-edit.component.html',
  styleUrls: ['./evento-edit.component.css']
})
export class EventoEditComponent implements OnInit {

  titulo = 'Editar Evento';
  registerForm: FormGroup;
  evento: Evento = new Evento();
  imagemURL = 'assets/img/upload.png';
  file: File;
  fileNameToUpdate: string;
  dataAtual = '';

  get lotes(): FormArray {
    return <FormArray>this.registerForm.get('lotes');
  }

  get redesSociais(): FormArray {
    return <FormArray>this.registerForm.get('redesSociais');
  }
  constructor(
    private eventoService: EventoService
    , private router: ActivatedRoute
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService

  ) {

    this.localeService.use('pt-br');
  }

  ngOnInit() {
    this.validation();
    this.carregarEvento();
  }

  carregarEvento() {
    const idEvento = +this.router.snapshot.paramMap.get('id'); // converter para number +
    this.dataAtual = new Date().getMilliseconds().toString();

    this.eventoService.getEventoById(idEvento)
      .subscribe(
        (evento: Evento) => {

          this.evento = Object.assign({}, evento);
          this.fileNameToUpdate = evento.imagemURL.toString();

          this.imagemURL = `http://localhost:5000/resources/images/${this.evento.imagemURL}?_ts=${this.dataAtual}`;

          this.evento.imagemURL = '';
          this.registerForm.patchValue(this.evento);

          this.evento.lotes.forEach(lote => {
            this.lotes.push(this.criaLote(lote));
          });
          this.evento.redesSociais.forEach(redeSocial => {
            this.redesSociais.push(this.criaRedesSociais(redeSocial));
          });
        }
      );

  }
  validation() {

    this.registerForm = this.fb.group({
      id: [],
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      imagemURL: [''],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lotes: this.fb.array([]),
      redesSociais: this.fb.array([])
    });
  }

  criaLote(lote: any): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim]
    });
  }

  adicionarLote() {
    this.lotes.push(this.criaLote({ id: 0 }));
  }

  removerLote(id: number) {
    this.lotes.removeAt(id);
  }


  criaRedesSociais(redeSocial: any): FormGroup {
    return this.fb.group({
      id: [redeSocial.id],
      nome: [redeSocial.nome, Validators.required],
      url: [redeSocial.url, Validators.required]
    });
  }

  adicionarRedeSocial() {
    this.redesSociais.push(this.criaRedesSociais({ id: 0 }));
  }

  removerRedeSocial(id: number) {
    this.redesSociais.removeAt(id);
  }

  onFileChange(evento: any, file: FileList) {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = evento.target.files;
    reader.readAsDataURL(file[0]);
  }

  salvarEvento() {
    // put
    // pego os valors do formulario
    this.evento = Object.assign({ id: this.evento.id }, this.registerForm.value);
    this.evento.imagemURL = this.fileNameToUpdate;

    this.uploadImagem();

    // console.log('Evento ', this.evento);

    this.eventoService.putEvento(this.evento).subscribe(
      () => {
        this.toastr.success('Editado com Sucesso!');
      }, error => {
        this.toastr.error(`Erro ao Editar: ${error}`);
      }
    );
  }
  uploadImagem() {
    if (this.registerForm.get('imagemURL').value !== '') {
      this.eventoService.postUpload(this.file, this.fileNameToUpdate)
        .subscribe(
          () => {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.imagemURL = `http://localhost:5000/resources/images/${this.evento.imagemURL}?_ts=${this.dataAtual}`;
          }
        );
    }
  }



}
