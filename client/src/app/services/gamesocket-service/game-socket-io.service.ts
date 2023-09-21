import { Injectable } from '@angular/core';
import { PublicSocketIoService } from '../publicsocket-service/public-socket-io.service';

@Injectable({
  providedIn: 'root'
})
export class GameSocketIoService {
  private socket;

  constructor(private publicSocketService: PublicSocketIoService) {
    this.socket = this.publicSocketService.getSocket();
  }

  
}
