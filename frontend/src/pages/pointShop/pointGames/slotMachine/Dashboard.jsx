import React from "react";
import Slot from "./Slot";
import "../../../../assets/style/SlotMachine.css";

const Dashboard = ({ rolling, slotRefs, fruits }) => {
    return (
        <div className="slot-machine">
            {slotRefs.map((ref, index) => (
                <Slot key={index} ref={ref} fruits={fruits} />
            ))}
        </div>
    );
};

export default Dashboard;
