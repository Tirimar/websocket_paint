import React, {FC, useState} from 'react';
import '../styles/toolbar.scss'
import toolState from "../store/toolState";

const SettingsBar: FC = () => {
    const [lineWidth, setLineWidth] = useState(1);
    const changeStrokeColor = (color: string) => {
        toolState.setStrokeColor(color);
    }
    const changeLineWidth = (width: number) => {
        if(width <= 50 && width >= 1){
            toolState.setLineWidth(width);
            setLineWidth(width);
        }
    }

    return (
        <div className="settingsbar">
            <label htmlFor="width-changer">Толщина линии</label>
            <input id="width-changer"
                   style={{marginLeft: 10}}
                   type="number" min={1} max={50} value={lineWidth}
                   onChange={e => {changeLineWidth(Number(e.target.value));}}
            />
            <input
                onChange={e => {
                changeStrokeColor(e.target.value);
            }} style={{marginLeft: 10}} type="color"/>
        </div>
    );
};

export default SettingsBar;