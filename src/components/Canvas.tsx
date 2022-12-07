import React, {FC, useEffect, useRef, useState} from 'react';
import '../styles/canvas.scss'
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import {Button, Modal} from 'react-bootstrap';
import {useParams} from "react-router-dom";
import Rect from "../tools/Rect";
import axios from "axios";
import Circle from "../tools/Circle";
import Line from "../tools/Line";
import Eraser from "../tools/Eraser";


//todo разделить типы
export interface Figure{
    type: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    fillColor?: string;
    strokeColor?: string;
    lineWidth?: number;
    dx?: number;
    dy?: number;
    dataUrl?: string;
}
export interface SocketData {
    method: string;
    id: string;
    username?: string;
    figure?: Figure;
}

const Canvas: FC = observer(() => {
    const canvasRef = useRef<HTMLCanvasElement>() as React.MutableRefObject<HTMLCanvasElement>;
    const usernameRef = useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;

    const [modal, setModal] = useState(true);

    const params = useParams();

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        axios.get(`http://localhost:5000/image?id=${params.id}`)
            .then(response => {
                const img = new Image();
                const ctx = canvasRef.current.getContext('2d');
                img.src = response.data;
                img.onload = () => {
                    if(ctx){
                        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                        ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                        ctx.stroke();
                    }
                }
            })
    }, []);

    useEffect(() => {
        if(canvasState.username) {
            canvasState.setSocket(new WebSocket(`ws://localhost:5000/`));
            if(params.id) canvasState.setSessionId(params.id.toString());
            const socket = canvasState.socket;
            if(socket){
                if(params.id) toolState.setTool(new Brush(canvasRef.current as HTMLCanvasElement, socket, params.id.toString()));
                socket.onopen = () => {
                    socket.send(JSON.stringify({
                        id: params.id,
                        username: canvasState.username,
                        method: 'connection'
                    }))
                }
                socket.onmessage = (event) => {
                    let msg = JSON.parse(event.data) as SocketData;
                    switch (msg.method){
                        case "connection":
                            console.log(`Пользователь ${msg.username} подключился.`)
                            break;
                        case "draw":
                            drawHandler(msg);
                            break;
                    }
                }
            }
        }
    }, [canvasState.username])

    const drawHandler = (msg: SocketData) => {
        const figure = msg.figure;
        const ctx = canvasRef.current.getContext('2d');
        if(figure && ctx){
            switch (figure.type){
                case 'brush':
                    Brush.draw(ctx, figure.x, figure.y);
                    break;
                case 'rect':
                    if (figure.width && figure.height && figure.fillColor && figure.strokeColor && figure.lineWidth){
                        Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.fillColor, figure.strokeColor, figure.lineWidth);
                    }
                    break;
                case 'circle':
                    if (figure.width && figure.height && figure.fillColor && figure.strokeColor && figure.lineWidth){
                        Circle.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.fillColor, figure.strokeColor, figure.lineWidth);
                    }
                    break;
                case 'line':
                    if (figure.strokeColor && figure.lineWidth && figure.dx && figure.dy){
                        Line.staticDraw(ctx, figure.x, figure.y, figure.dx, figure.dy, figure.strokeColor, figure.lineWidth);
                    }
                    break;
                case 'eraser':
                    if (figure.strokeColor && figure.lineWidth){
                        Eraser.draw(ctx, figure.x, figure.y, figure.strokeColor, figure.lineWidth);
                    }
                    break;
                case 'redo':
                    let img = new Image();
                    if(figure.dataUrl) img.src = figure.dataUrl;
                    img.onload = () => {
                        if (ctx && canvasRef.current && figure.dataUrl) {
                            canvasState.redoList.pop();
                            // canvasState.pushToUndo(figure.dataUrl);
                            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                            ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                        }
                    }
                    break;
                case 'undo':
                    let img1 = new Image();
                    if(figure.dataUrl) img1.src = figure.dataUrl;
                    img1.onload = () => {
                        if (ctx && canvasRef.current && figure.dataUrl) {
                            canvasState.pushToRedo(figure.dataUrl);
                            // canvasState.undoList.pop();
                            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                            ctx.drawImage(img1, 0, 0, canvasRef.current.width, canvasRef.current.height)
                        }
                    }
                    break;
                case 'finish':
                    ctx.beginPath();
                    break;

            }
        }
    }
    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
    }

    const connectionHandler = () => {
        canvasState.setUsername(usernameRef.current.value);
        setModal(false);
    }

    return (
        <div className="canvas">
            <Modal show={modal} onHide={() => {}}>
                <Modal.Header closeButton>
                    <Modal.Title>Your name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input ref={usernameRef} type="text"/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => connectionHandler()}>
                        Принять
                    </Button>
                </Modal.Footer>
            </Modal>
            <canvas onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={680} height={480}/>
        </div>
    );
});

export default Canvas;