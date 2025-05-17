import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { FacadeService } from './facade.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) {}

  public esquemaEvento() {
    return {
      'titulo': '', //solo letras, numeros y espacios no se permite caracteres especiales 
      'Tipo_de_evento': '', 
      'fecha_inicio': '', //se utilizara un datepicker
      'fecha_fin': '', //se utilizara un datepicker
      'lugar': '', //solo admitir caracteres alfanumericos y espacios
      'publico_objetivo': '',
      'Programa_educativo':'',
      'Responsable_del_evento':'',
      'descripcion_breve': '', //limite maximo de 300caracteres solo se permiten letras, numeros y signos de puntuacion basico 
      'cupo_max':'', //solo numeros de maximo 3 digitos 
    };
  }

  //Validación para el formulario
public validarEvento(data: any, editar: boolean) {
  console.log("Validando evento... ", data);
  let error: any = [];

  if (!this.validatorService.required(data["titulo"])) {
    error["titulo"] = this.errorService.required;
  } else if (!this.validatorService.wordsAndNumbers(data["titulo"])) {
    error["titulo"] = "El título solo puede contener letras, números y espacios.";
  }

  if (!this.validatorService.required(data["Tipo_de_evento"])) {
    error["Tipo_de_evento"] = this.errorService.required;
  }

  if (!this.validatorService.required(data["fecha_inicio"])) {
    error["fecha_inicio"] = this.errorService.required;
  } else if (!this.validatorService.date(data["fecha_inicio"])) {
    error["fecha_inicio"] = this.errorService.betweenDate;
  }

  if (!this.validatorService.required(data["fecha_fin"])) {
    error["fecha_fin"] = this.errorService.required;
  } else if (!this.validatorService.date(data["fecha_fin"])) {
    error["fecha_fin"] = this.errorService.betweenDate;
  }

  if (!this.validatorService.required(data["lugar"])) {
    error["lugar"] = this.errorService.required;
  } else if (!this.validatorService.wordsAndNumbers(data["lugar"])) {
    error["lugar"] = "El lugar solo puede contener letras, números y espacios.";
  }

  if (!this.validatorService.required(data["publico_objetivo"])) {
    error["publico_objetivo"] = this.errorService.required;
  }

  if (!this.validatorService.required(data["Programa_educativo"])) {
    error["Programa_educativo"] = this.errorService.required;
  }

  if (!this.validatorService.required(data["Responsable_del_evento"])) {
    error["Responsable_del_evento"] = this.errorService.required;
  }

  if (!this.validatorService.required(data["descripcion_breve"])) {
    error["descripcion_breve"] = this.errorService.required;
  } else if (!this.validatorService.max(data["descripcion_breve"], 300)) {
    error["descripcion_breve"] = this.errorService.max(300);
  }

  if (!this.validatorService.required(data["cupo_max"])) {
    error["cupo_max"] = this.errorService.required;
  } else if (!this.validatorService.numeric(data["cupo_max"])) {
    error["cupo_max"] = this.errorService.numeric;
  } else if (!this.validatorService.max(data["cupo_max"].toString(), 3)) {
    error["cupo_max"] = "El cupo máximo no puede exceder 3 dígitos.";
  }

  return error;
}

  
  // CRUD HTTP Services
  //no mover aun

  public registrarEvento(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.post<any>(`${environment.url_api}/eventos/`, data, { headers });
  }

  public obtenerEventos(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.get<any>(`${environment.url_api}/lista-eventos/`, { headers });
  }

  public getEventoByID(idEvento: number): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/eventos/?id=${idEvento}`, httpOptions);
  }

  public editarEvento(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.put<any>(`${environment.url_api}/eventos-edit/`, data, { headers });
  }

  public eliminarEvento(idEvento: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.delete<any>(`${environment.url_api}/eventos-edit/?id=${idEvento}`, { headers });
  }
}
