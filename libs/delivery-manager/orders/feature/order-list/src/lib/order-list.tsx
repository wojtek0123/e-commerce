import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useQuery } from '@tanstack/react-query';
import { OrderDetails } from '@e-commerce/shared/api-models';
import axios from 'axios';

const socket = io('http://localhost:3000');

export function OrderList() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [newOrders, setNewOrders] = useState<OrderDetails[]>([]);
  const { isLoading, error, data } = useQuery<OrderDetails[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await axios.get<OrderDetails[]>(
        'http://localhost:3000/order-details',
      );
      return data;
    },
  });

  function addOrder(order: OrderDetails) {
    setNewOrders((prevState) => [...prevState, order]);
  }

  function onConnect() {
    setIsConnected(true);
  }

  function onDisconnect() {
    setIsConnected(false);
  }

  function onError(error: unknown) {
    console.log(error);
  }

  useEffect(() => {
    socket.on('order', addOrder);
    socket.on('connect', onConnect);
    socket.on('exception', onError);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('order', addOrder);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('exception', onError);
    };
  }, []);

  useEffect(() => {
    console.log(isConnected);
  }, [isConnected]);

  if (isLoading) {
    return <div>Loading....</div>;
  }

  if (error) {
    return <div>{(error as any)?.message}</div>;
  }

  return (
    <div className="w-full">
      {data?.length !== 0 && (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Order no.</th>
                <th>Created at</th>
                <th>Status</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {data?.length &&
                [...data, ...newOrders].map((order) => (
                  <tr>
                    <th>1</th>
                    <td>{order.id}</td>
                    <td>{order.createdAt}</td>
                    <td>{order.status}</td>
                    <td>
                      <button className="btn">
                        <span className="pi pi-box"></span>
                        <span>Pack up</span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <h2>New orders</h2>
      {newOrders?.length !== 0 && (
        <ul>{newOrders?.map((order) => <li key={order.id}>{order.id}</li>)}</ul>
      )}
    </div>
  );
}

export default OrderList;
