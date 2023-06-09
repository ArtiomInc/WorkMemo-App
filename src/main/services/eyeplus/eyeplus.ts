import net from "net";

export class EyeplusException extends Error {
  constructor(msg: string | undefined) {
    super(msg);
    // The parent constructor also sets the name property to "Error", so we reset it to the right value.
    this.name = "AsycubeException";
  }
}

export class ProtocolException extends Error {
  constructor(msg: string | undefined) {
    super(msg);
    // The parent constructor also sets the name property to "Error", so we reset it to the right value.
    this.name = "ProtocolException";
  }
}

export class ConnectionException extends Error {
  constructor(msg: string | undefined) {
    super(msg);
    // The parent constructor also sets the name property to "Error", so we reset it to the right value.
    this.name = "ConnectionException";
  }
}

export class Eyeplus {
  static address: string = "10.70.0.60";
  static port: number = 7171;
  static socket: net.Socket;
  static connected: boolean;
  static busy: any;

  async connect(): Promise<void> {
    try {
      Eyeplus.connected = await new Promise<boolean>((resolve, reject) => {
        console.log(
          `eyeplus.connect: Try to connect to TCP EYE+ at ${Eyeplus.address}:${Eyeplus.port}`
        );
        Eyeplus.socket = net.createConnection(
          { port: Eyeplus.port, host: Eyeplus.address },
          () => {
            clearTimeout(timer);
            Eyeplus.socket.setTimeout(3000);
            resolve(true);
          }
        );
        Eyeplus.socket.on("error", () => {
          Eyeplus.socket.destroy();
          clearTimeout(timer);
          Eyeplus.connected = false;
          reject(new ConnectionException("eyeplus.error.connection_error"));
        });
        const timer = setTimeout(() => {
          reject(new ConnectionException("eyeplus.error.connection_timeout"));
          Eyeplus.socket.destroy();
          resolve(false);
        }, 500);
      });
    } catch (error) {
      console.log("eyeplus.connect: " + error);
      throw error;
    }
    Eyeplus.busy = false;
  }

  async disconnect(): Promise<void> {
    console.log(`eyeplus.disconnect: Disconnected from TCP EYE+`);
    Eyeplus.socket.end();
    Eyeplus.connected = false;
  }

  async sendMessage(command: string): Promise<string | null> {
    const response = await this.sendToEyeplus(command + "\n");
    return response;
  }

  private async sendToEyeplus(command: string): Promise<string> {
    // Add a failsafe to prevent sending two commands at the same time
    while (Eyeplus.busy) {
      if (!Eyeplus.connected) {
        throw new ConnectionException("eyeplus.error.not_connected");
      }
      await new Promise((r) => setTimeout(r, 1));
    }
    Eyeplus.busy = true;
    const response: string = await new Promise((resolve, reject) => {
      const dataFunction = (data: Buffer) => {
        clearTimeout(timer);
        Eyeplus.socket.off("timeout", timeoutFunction);
        Eyeplus.busy = false;
        resolve(data.toString().trim());
      };
      const timeoutFunction = () => {
        clearTimeout(timer);
        const error = new ConnectionException(
          "eyeplus.error.connection_timeout"
        );
        Eyeplus.socket.off("data", dataFunction);
        Eyeplus.socket.destroy();
        Eyeplus.connected = false;
        console.log("eyeplus.sendToEyeplus: " + error);
        reject(error);
      };
      Eyeplus.socket.once("data", dataFunction);
      Eyeplus.socket.once("timeout", timeoutFunction);
      Eyeplus.socket.write(command);

      // Add a timer here in case we don't receive a response but timeout is not triggered
      const timer = setTimeout(() => {
        Eyeplus.socket.destroy();
        const error = new ConnectionException(
          "eyeplus.error.connection_timeout"
        );
        reject(error);
      }, 5000);
    });
    return response;
  }
}
