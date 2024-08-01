import React, { useImperativeHandle, forwardRef, useState, useEffect } from "react";
import "../../../../assets/style/SlotMachine.css";

const Slot = forwardRef(({ fruits }, ref) => {
    const [rolling, setRolling] = useState(false);
    const [position, setPosition] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    useImperativeHandle(ref, () => ({
        startRolling() {
            setRolling(true);
        },
        stopRolling() {
            setRolling(false);
            clearInterval(intervalId);
        },
        reset() {
            setRolling(false);
            clearInterval(intervalId);
            setPosition(0);
        },
        getResult() {
            const totalHeight = fruits.length * 90;
            const normalizedPosition = (position % totalHeight + totalHeight) % totalHeight;
            const index = Math.floor((normalizedPosition + 45) / 90) % fruits.length; // Adjust to ensure accurate result
            return fruits[index];
        }
    }));

    useEffect(() => {
        if (rolling) {
            const id = setInterval(() => {
                setPosition((prev) => {
                    const newPos = prev - 20; // Increase speed by increasing the value
                    if (newPos <= -fruits.length * 90) {
                        return 0; // Reset the scroll when it reaches the end
                    }
                    return newPos;
                });
            }, 20); // Increase speed by decreasing the interval time
            setIntervalId(id);
        } else {
            clearInterval(intervalId);
        }
        return () => clearInterval(intervalId);
    }, [rolling]);

    return (
        <div className="slot">
            <section className="slot-section">
                <div className="slot-container" style={{ top: `${position}px` }}>
                    {fruits.concat(fruits).map((fruit, i) => (
                        <div key={i}>
                            <span>{fruit}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
});

export default Slot;
