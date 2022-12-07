import React, {FC, useState} from 'react';
import '../styles/toolbar.scss'
import Brush from "../tools/Brush";
import toolState from "../store/toolState";
import canvasState from "../store/canvasState";
import Rect from "../tools/Rect";
import Eraser from "../tools/Eraser";
import Circle from "../tools/Circle";
import Line from "../tools/Line";
import canvas from "./Canvas";

const ToolBar: FC = () => {
    const changeFillColor = (color: string) => {
        toolState.setFillColor(color);
    }

    const savePicture = () => {
        const dataUrl = canvasState.canvas?.toDataURL();
        const a = document.createElement('a');
        if(dataUrl) {
            a.href = dataUrl;
            a.download = canvasState.sessionId+'.jpg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

    }

    return (
        <div className="toolbar">
            <button onClick={() => {if (canvasState.socket) toolState.setTool( new Brush(canvasState.canvas as HTMLCanvasElement, canvasState.socket, canvasState.sessionId))}}
                    className="toolbar__btn brush"/>
            <button onClick={() => {if (canvasState.socket) toolState.setTool( new Rect(canvasState.canvas as HTMLCanvasElement, canvasState.socket, canvasState.sessionId))}}
                className="toolbar__btn rect"/>
            <button onClick={() => {if (canvasState.socket) toolState.setTool( new Circle(canvasState.canvas as HTMLCanvasElement, canvasState.socket, canvasState.sessionId))}}
                className="toolbar__btn circle"/>
            <button onClick={() => {if (canvasState.socket) toolState.setTool( new Eraser(canvasState.canvas as HTMLCanvasElement, canvasState.socket, canvasState.sessionId))}}
                className="toolbar__btn eraser"/>
            <button onClick={() => {if (canvasState.socket) toolState.setTool( new Line(canvasState.canvas as HTMLCanvasElement, canvasState.socket, canvasState.sessionId))}}
                className="toolbar__btn line"/>
            <input
                onChange={e => {
                changeFillColor(e.target.value);
            }} style={{marginLeft: 10}} type="color"/>
            <button onClick={() => canvasState.undo()}
                className="toolbar__btn undo"/>
            <button onClick={() => canvasState.redo()}
                className="toolbar__btn redo"/>
            <button onClick={() => savePicture()}
                className="toolbar__btn save"/>
        </div>
    );
};

export default ToolBar;