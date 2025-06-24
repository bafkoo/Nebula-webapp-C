import * as signalR from "@microsoft/signalr";
import { TokenManager } from "./api";
import type { MessageDto } from "../types/chat";

const API_BASE_URL = "http://localhost:5001";
const HUB_URL = `${API_BASE_URL}/chatHub`;

type HubMethodCallbacks = {
  ReceiveMessage: (message: MessageDto) => void;
  UserTyping: (data: { userId: string, username: string, chatId: string, isTyping: boolean }) => void;
  // TODO: Добавить другие методы хаба по мере необходимости
  // MessageRead: (chatId: string, messageId: string) => void;
};

// Типы для методов, которые можно вызывать с клиента
type HubInvokeMethods = {
  SendMessage: (chatId: string, content: string, tempId: string) => void;
  SetTyping: (chatId: string, isTyping: boolean) => void;
  // TODO: Добавить другие методы по мере необходимости
  // SendTypingIndicator: (chatId: string, isTyping: boolean) => void;
};

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnectionStarted = false;

  public startConnection = async (): Promise<void> => {
    if (this.isConnectionStarted) {
      console.warn("SignalR: Connection already started or is starting.");
      return;
    }
    this.isConnectionStarted = true;

    const token = TokenManager.getToken();
    if (!token) {
      console.error("SignalR: No token found, connection aborted.");
      this.isConnectionStarted = false;
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .build();

    this.connection.onclose(() => {
      console.log("SignalR: Connection closed.");
      this.isConnectionStarted = false;
    });

    try {
      await this.connection.start();
      console.log("SignalR: Connection started successfully.");
    } catch (err) {
      console.error("SignalR: Error while starting connection: ", err);
      this.isConnectionStarted = false;
      setTimeout(() => this.startConnection(), 5000);
    }
  };
  
  public stopConnection = async (): Promise<void> => {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.stop();
      } catch (err) {
        console.error("SignalR: Error while stopping connection: ", err);
      }
    }
    this.isConnectionStarted = false;
  };

  public on = <T extends keyof HubMethodCallbacks>(event: T, callback: HubMethodCallbacks[T]) => {
    this.connection?.on(event, callback);
  };
  
  public off = <T extends keyof HubMethodCallbacks>(event: T, callback: HubMethodCallbacks[T]) => {
    this.connection?.off(event, callback);
  };
  
  public invoke = async <T extends keyof HubInvokeMethods>(
    methodName: T, 
    ...args: Parameters<HubInvokeMethods[T]>
  ): Promise<void> => {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke(methodName, ...args);
      } catch (err) {
        console.error(`SignalR: Error invoking ${methodName}:`, err);
        throw err;
      }
    } else {
      const errorMsg = "SignalR: Connection is not established.";
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Конкретные методы для вызова
  public sendMessage = (chatId: string, content: string, tempId: string) => {
    return this.invoke("SendMessage", chatId, content, tempId);
  }

  public setTyping = (chatId: string, isTyping: boolean) => {
    return this.invoke("SetTyping", chatId, isTyping);
  }
}

const signalrService = new SignalRService();
export default signalrService; 