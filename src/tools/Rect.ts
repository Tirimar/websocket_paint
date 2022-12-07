import Tool from "./Tool";

export default class Rect extends Tool{
    private mouseDown: boolean;
    private prevX: number;
    private prevY: number;
    private width: number;
    private height: number;
    private saved: string | undefined;
    constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string) {
        super(canvas, socket, id);
        this.listen();
        this.mouseDown = false;
        this.prevX = 0;
        this.prevY = 0;
        this.width = 0;
        this.height = 0;
    }
    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }
    mouseUpHandler(e: MouseEvent){
        this.mouseDown = false;
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'rect',
                x: this.prevX,
                y: this.prevY,
                width: this.width,
                height: this.height,
                fillColor: this.ctx.fillStyle,
                strokeColor: this.ctx.strokeStyle,
                lineWidth: this.ctx.lineWidth
            }
        }))
    }
    mouseDownHandler(e: any){
        this.mouseDown = true;
        this.ctx.beginPath();
        this.prevX = e.pageX - e.target.offsetLeft;
        this.prevY = e.pageY - e.target.offsetTop;
        this.saved = this.canvas.toDataURL();
    }
    mouseMoveHandler(e: any){
        if(this.mouseDown){
            let currentX = e.pageX - e.target.offsetLeft;
            let currentY = e.pageY - e.target.offsetTop;
            this.width = currentX - this.prevX;
            this.height = currentY- this.prevY;
            this.draw(this.prevX, this.prevY, this.width, this.height);
        }
    }

    draw(x: number, y: number, w: number, h: number){
        const img = new Image();
        if (typeof this.saved === "string") {
            img.src = this.saved;
        }
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();
            this.ctx.rect(x, y ,w, h);
            this.ctx.fill();
            this.ctx.stroke();
        }
    }
    static staticDraw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fillColor: string, strokeColor: string, lineWidth: number){
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.rect(x, y ,w, h);
        ctx.fill();
        ctx.stroke();
    }
}