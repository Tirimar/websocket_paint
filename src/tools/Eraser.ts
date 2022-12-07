import Tool from "./Tool";
export default class Brush extends Tool{
    private mouseDown: boolean;
    constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string) {
        super(canvas, socket, id);
        this.listen();
        this.mouseDown = false;
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
                type: 'finish',
            }
        }))
    }
    mouseDownHandler(e: any){
        this.mouseDown = true;
        this.ctx.beginPath();
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
    }
    mouseMoveHandler(e: any){
        if(this.mouseDown){
            // this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'eraser',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    strokeColor: '#FFFFFF',
                    lineWidth: this.ctx.lineWidth
                }
            }))
        }
    }

    static draw(ctx: CanvasRenderingContext2D, x: number, y: number, strokeColor: string, lineWidth: number){
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}