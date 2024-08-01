import React, { useState, useRef } from "react";
import Dashboard from "./Dashboard";
import "../../../../assets/style/pointGame/slot/SlotMachine.css";

const SlotMachine = () => {
    const [rolling, setRolling] = useState(false);
    const [stoppedSlots, setStoppedSlots] = useState(0);
    const [resultMessage, setResultMessage] = useState("");
    const slotRefs = [useRef(null), useRef(null), useRef(null)];
    const fruits = ["🍒", "🍉", "🍊", "🍓", "🍇", "🥝"];

    const roll = () => {
        if (!rolling) {
            setRolling(true);
            setStoppedSlots(0);
            setResultMessage("");
            startRolling();
        } else {
            stopSlot();
        }
    };

    const startRolling = () => {
        slotRefs.forEach((slot) => {
            if (slot.current) {
                slot.current.startRolling();
            }
        });
    };

    const stopSlot = () => {
        slotRefs[stoppedSlots].current.stopRolling();
        setStoppedSlots((prev) => {
            const newStoppedSlots = prev + 1;
            if (newStoppedSlots === 3) {
                setRolling(false);
                setTimeout(checkResult, 500); // Give some time for the slots to stop completely
            }
            return newStoppedSlots;
        });
    };

    const checkResult = () => {
        const slotItems = slotRefs.map(ref => ref.current.getResult());
        const isWin = slotItems.every((item, _, arr) => item === arr[0]);
        setResultMessage(isWin ? "당첨!" : "다음 기회에...");
    };

    const reset = () => {
        setRolling(false);
        setStoppedSlots(0);
        setResultMessage("");
        slotRefs.forEach(slot => {
            if (slot.current) {
                slot.current.reset();
            }
        });
    };

    return (
        <div className="slot-game">
            <Dashboard rolling={rolling} slotRefs={slotRefs} fruits={fruits} />
            <div className="machine-controls">
                <div className="machine-roll" onClick={roll}>
                    {rolling ? `STOP ${3 - stoppedSlots}` : "ROLL"}
                </div>
                <div className="machine-reset" onClick={reset}>
                    RESET
                </div>
            </div>
            {resultMessage && <div className="slot-result">{resultMessage}</div>}
        </div>
    );
};

export default SlotMachine;
