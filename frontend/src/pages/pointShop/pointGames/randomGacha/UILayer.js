import React, {forwardRef} from 'react';
import Prize from '../randomGacha/Prize';
import '../../../../assets/style/UILayer.scss';

const UILayer = forwardRef((props, ref) => {
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
