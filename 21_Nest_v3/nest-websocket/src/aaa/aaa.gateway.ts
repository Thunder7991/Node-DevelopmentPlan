import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { AaaService } from './aaa.service';
import { CreateAaaDto } from './dto/create-aaa.dto';
import { UpdateAaaDto } from './dto/update-aaa.dto';
import { Observable } from 'rxjs';
import { Server } from 'socket.io';

@WebSocketGateway()
export class AaaGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly aaaService: AaaService) {}
  @SubscribeMessage('createAaa')
  create(@MessageBody() createAaaDto: CreateAaaDto) {
    this.server.emit('chen', 777);
    return this.aaaService.create(createAaaDto);
  }

  @SubscribeMessage('findAllAaa')
  findAll() {
    // return {
    //   event:'chen',
    //   data:this.aaaService.findAll()
    // }
    return new Observable((observer) => {
      observer.next({
        event: 'chen',
        data: this.aaaService.findAll(),
      });
      setTimeout(() => {
        observer.next({ event: 'chen', data: { msg: 'bbb' } });
      }, 2000);

      setTimeout(() => {
        observer.next({ event: 'chen', data: { msg: 'ccc' } });
      }, 5000);
    });
  }

  @SubscribeMessage('findOneAaa')
  findOne(@MessageBody() id: number, @ConnectedSocket() server: Server) {
    server.emit('chen', 666);
    return this.aaaService.findOne(id);
  }

  @SubscribeMessage('updateAaa')
  update(@MessageBody() updateAaaDto: UpdateAaaDto) {
    return this.aaaService.update(updateAaaDto.id, updateAaaDto);
  }

  @SubscribeMessage('removeAaa')
  remove(@MessageBody() id: number) {
    return this.aaaService.remove(id);
  }

  handleDisconnect(client: Server) {
    console.log(client);
    
  }

  handleConnection(client: Server, ...args: any[]) {

    console.log(client,args);
  }

  afterInit(server: Server) {
    console.log(server);
    
  }
}
