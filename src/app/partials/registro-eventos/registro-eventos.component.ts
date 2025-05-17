import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FacadeService } from 'src/app/services/facade.service';
import { EventosService } from 'src/app/services/eventos.service';

declare var $: any;

@Component({
  selector: 'app-registro-eventos',
  templateUrl: './registro-eventos.component.html',
  styleUrls: ['./registro-eventos.component.scss']
})
export class EventosComponent implements OnInit {
  @Input() datos_evento: any = {};

  public evento: any = {};
  public errors: any = {};
  public editar: boolean = false;

  // Listas para los select y checkboxes
  public programas: string[] = ['Ingeniería 1', 'Ingeniería 2', 'Ingeniería 3'];
  public tiposEvento: string[] = ['Conferencia', 'Taller', 'Seminario', 'Congreso']; // Puedes ajustarlos a lo que necesites
  public publicos: string[] = ['Estudiantes', 'Profesores', 'Público General'];

  constructor(
    private eventosService: EventosService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private facadeService: FacadeService
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    
    if (id !== undefined) {
      // Si se está editando un evento
      this.editar = true;
      this.evento = { ...this.datos_evento }; // Asegura que sea una copia separada
    } else {
      // Si es nuevo registro
      this.evento = this.eventosService.esquemaEvento();
      this.evento.publico_objetivo = [];
    }
  }

  public regresar(): void {
    this.location.back();
  }

  public registrar(): void {
    this.errors = this.eventosService.validarEvento(this.evento, this.editar);

    if (!$.isEmptyObject(this.errors)) {
      return;
    }

    this.eventosService.registrarEvento(this.evento).subscribe({
      next: () => {
        alert('Evento registrado correctamente');
        this.router.navigate(['home']);
      },
      error: () => {
        alert('No se pudo registrar el evento');
      }
    });
  }

  public actualizar(): void {
    this.errors = this.eventosService.validarEvento(this.evento, this.editar);

    if (!$.isEmptyObject(this.errors)) {
      return;
    }

    this.eventosService.editarEvento(this.evento).subscribe({
      next: () => {
        alert('Evento actualizado correctamente');
        this.router.navigate(['home']);
      },
      error: () => {
        alert('No se pudo actualizar el evento');
      }
    });
  }

  // Manejo de checkboxes de público objetivo
  public checkboxPublicoChange(event: any): void {
    const value = event.source.value;

    if (event.checked) {
      if (!this.evento.publico_objetivo.includes(value)) {
        this.evento.publico_objetivo.push(value);
      }
    } else {
      this.evento.publico_objetivo = this.evento.publico_objetivo.filter((p: string) => p !== value);
    }
  }

  public revisarPublico(valor: string): boolean {
    return this.evento.publico_objetivo?.includes(valor);
  }

  // Conversión de fechas al formato YYYY-MM-DD
  public changeFechaInicio(event: any): void {
    const fecha = event.value;
    if (fecha) {
      this.evento.fecha_inicio = fecha.toISOString().split('T')[0];
    }
  }

  public changeFechaFin(event: any): void {
    const fecha = event.value;
    if (fecha) {
      this.evento.fecha_fin = fecha.toISOString().split('T')[0];
    }
  }
}
