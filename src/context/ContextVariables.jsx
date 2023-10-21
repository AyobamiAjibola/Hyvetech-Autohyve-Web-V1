import { useState, useLayoutEffect } from "react";

export default function ContextVariables() {
    const [active, setActive] = useState(false);

    const [contextVal, setContextVal] = useState(
        [
            {active, setActive},
        ]);

    useLayoutEffect(() => {
        setContextVal([
            {active, setActive},
        ])
        }, [active]);
    
    return contextVal
};