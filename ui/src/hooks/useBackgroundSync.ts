import { useState, useEffect } from 'react';

interface PendingRequest {
  id: string;
  url: string;
  options: RequestInit;
  timestamp: number;
}

export function useBackgroundSync() {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const processPendingRequests = async () => {
    if (!isOnline || pendingRequests.length === 0) return;

    console.log(`📨 Processando ${pendingRequests.length} requisições pendentes...`);

    for (const request of pendingRequests) {
      try {
        const response = await fetch(request.url, request.options);
        
        if (response.ok) {
          console.log(`✅ Requisição ${request.id} processada com sucesso`);
          removePendingRequest(request.id);
          
          // Dispatch evento customizado para notificar a UI
          window.dispatchEvent(new CustomEvent('backgroundSyncSuccess', {
            detail: { requestId: request.id, response: await response.clone().json() }
          }));
        } else {
          console.warn(`⚠️ Requisição ${request.id} falhou: ${response.status}`);
        }
      } catch (error) {
        console.warn(`❌ Erro ao processar requisição ${request.id}:`, error);
        
        // Remove requisições muito antigas (24h)
        if (Date.now() - request.timestamp > 24 * 60 * 60 * 1000) {
          console.log(`🗑️ Removendo requisição expirada ${request.id}`);
          removePendingRequest(request.id);
        }
      }
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      processPendingRequests();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Carregar requisições pendentes do localStorage
    loadPendingRequests();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline, pendingRequests.length]);

  const queueRequest = async (url: string, options: RequestInit = {}): Promise<Response | null> => {
    if (isOnline) {
      try {
        return await fetch(url, options);
      } catch (error) {
        // Se falhar mesmo online, adiciona à fila
        console.log('📤 Adicionando requisição à fila de background sync');
        addPendingRequest(url, options);
        throw error;
      }
    } else {
      // Offline: adiciona à fila automaticamente
      console.log('📴 Offline: Adicionando requisição à fila');
      addPendingRequest(url, options);
      throw new Error('Offline: Requisição adicionada à fila de sincronização');
    }
  };

  return {
    isOnline,
    pendingRequests,
    queueRequest,
    processPendingRequests
  };
}
