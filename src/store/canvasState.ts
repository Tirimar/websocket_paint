import {makeAutoObservable} from "mobx";

class CanvasState {
    canvas: HTMLCanvasElement | null = null;
    socket: WebSocket | null = null;
    sessionId: string = "";
    undoList: string[] = [];
    redoList: string[] = [];
    username = "";
    id = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setUsername(username: string) {
        this.username = username;
    }

    setSessionId(sessionId: string) {
        this.sessionId = sessionId;
    }

    setSocket(socket: WebSocket) {
        this.socket = socket;
    }

    setCanvas(canvas: HTMLCanvasElement | null) {
        this.canvas = canvas;
    }

    pushToUndo(data: string) {
        this.undoList.push(data)
    }

    pushToRedo(data: string) {
        this.redoList.push(data)
    }

    undo() {
        if (this.canvas !== null) {
            let ctx = this.canvas.getContext('2d');
            if (ctx !== null) {
                if (this.undoList.length > 0) {
                    let dataUrl = this.undoList.pop() as string;
                    // this.pushToRedo(dataUrl);
                    let img = new Image();
                    img.src = dataUrl;
                    img.onload = () => {
                        if (ctx !== null && this.canvas !== null && dataUrl !== undefined) {
                            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                            ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
                            if (this.socket) {
                                this.socket.send(JSON.stringify({
                                    method: 'draw',
                                    id: this.id,
                                    figure: {
                                        type: 'undo',
                                        dataUrl: dataUrl,
                                    }
                                }))
                            }
                        }
                    }
                } else {
                    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                }
            }
        }
    }

    redo() {
        if (this.canvas !== null) {
            let ctx = this.canvas.getContext('2d');
            if (this.redoList.length > 0) {
                let dataUrl = this.redoList.pop() as string;
                // this.pushToUndo(dataUrl);
                let img = new Image();
                img.src = dataUrl;
                img.onload = () => {
                    if (ctx !== null && this.canvas !== null && dataUrl !== undefined) {
                        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                        ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
                        if (this.socket) {
                            this.socket.send(JSON.stringify({
                                method: 'draw',
                                id: this.id,
                                figure: {
                                    type: 'redo',
                                    dataUrl: dataUrl,
                                }
                            }))
                        }
                    }
                }
            }
        }
    }
}

export default new CanvasState();