import React, {forwardRef} from 'react';
import Prize from './Prize';
import '../../../../assets/style/pointGame/gacha/UILayer.scss';
import {useNavigateNone} from "../../../../hooks/NavigateComponentHooks";

const UILayer = forwardRef((props, ref) => {

    useNavigateNone();

    return (
        <div className="ui-layer" ref={ref}>
            <div className="title-container">
                <div className="title">
                </div>
            </div>
            <Prize />
        </div>
    );
});

export default UILayer;
