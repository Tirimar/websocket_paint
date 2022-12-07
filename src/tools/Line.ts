import Tool from "./Tool";

export default class Line extends Tool{
    private mouseDown: boolean;
    private prevX: number;
    private prevY: number;
    private currentX: number;
    private currentY: number;
    private saved: string | undefined;
    constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string) {
        super(canvas, socket, id);
        this.listen();
        this.mouseDown = false;
        this.prevX = 0;
        this.prevY = 0;
        this.currentX = 0;
        this.currentY = 0;
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
                type: 'line',
                x: this.prevX,
                y: this.prevY,
                dx: this.currentX,
                dy: this.currentY,
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
            this.currentX = e.pageX - e.target.offsetLeft;
            this.currentY = e.pageY - e.target.offsetTop;
            this.draw(this.prevX, this.prevY, this.currentX, this.currentY);
        }
    }

    draw(x: number, y: number, dx: number, dy: number){
        const img = new Image();
        if (typeof this.saved === "string") {
            img.src = this.saved;
        }
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();
            this.ctx.moveTo(dx, dy);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
    }
    static staticDraw(ctx: CanvasRenderingContext2D, x: number, y: number, dx: number, dy: number, strokeColor: string, lineWidth: number){
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(dx, dy);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}