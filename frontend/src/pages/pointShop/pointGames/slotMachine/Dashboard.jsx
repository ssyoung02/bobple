import React from "react";
import Slot from "./Slot";
import "../../../../assets/style/pointGame/slot/SlotMachine.css";

const Dashboard = ({ slotRefs, fruits }) => {
    return (
        <div>
            {slotRefs.map((ref, index) => (
                <Slot key={index} ref={ref} fruits={fruits} />
            ))}
        </div>
    );
};

export default Dashboard;
