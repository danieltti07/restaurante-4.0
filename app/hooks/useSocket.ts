'use client'; // necessário se estiver usando App Router

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (onStatusUpdate: (status: string) => void) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('https://restaurante-4-0.onrender.com/'); // ou seu domínio do backend
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Conectado ao WebSocket');
    });

    socket.on('orderStatusUpdate', (status: string) => {
      console.log('Status atualizado:', status);
      onStatusUpdate(status);
    });

    return () => {
      socket.disconnect();
    };
  }, [onStatusUpdate]);

  return socketRef.current;
};
