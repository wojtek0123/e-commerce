import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OrderDetail } from '../../order-details/entities/order-detail.entity';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4202',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('order')
  order(@MessageBody() order: OrderDetail) {
    return order;
  }
}
