import net = require('net');

export class client {

    public socket: net.Socket;
    //public isPresenting: boolean;

    constructor(socket: net.Socket) {
        this.socket = socket;
        //this.isPresenting = false;

        this._setupSocket();
    }

    public isEqual(clientObj: client): boolean {
        return this.socket === clientObj.socket;
    }

    private _setupSocket() {
        // 'data' is an event that means that a message was just sent by the 
        // client application
        this.socket.on('data', function (data) {
            let clientData = data.toString();
            // Loop through all of our sockets and send the data
            //for (var i = 0; i < sockets.length; i++) {
            //    // Don't send the data back to the original sender
            //    if (sockets[i] == socket) // don't send the message to yourself
            //        continue;
            //    // Write the msg sent by chat client
            //    sockets[i].write(msg_sent);
            //}
            if (clientData === "PresentationStart") {
                console.log(`The client has started a PowerPoint presentation.  ${JSON.stringify(this.address())}`);
                console.log(`Can now start sending commands.`);
                this["isPresenting"] = true;
            }
            else if (clientData === "PresentationEnd") {
                console.log(`The client has ended a PowerPoint presentation.  ${JSON.stringify(this.address())}`);
                console.log("Commands can no longer be sent.");
                this["isPresenting"] = false;
            }
            else {
                console.log(data.toString());
            }
        });
    }

    public movePresentationForward() {
        if (this.socket["isPresenting"]) {
            this.socket.write("MovePresentationForward");
            console.log(`Moved client presentation forward.`);
        } else {
            console.log(`Client is not presenting now.`);
        }
    }

    public movePresentationBackward() {
        if (this.socket["isPresenting"]) {
            this.socket.write("MovePresentationBackward");
            console.log(`Moved client presentation backward.`);
        } else {
            console.log(`Client is not presenting now.`);
        }
    }
}