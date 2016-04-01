var connectorPaintStyle = {
        lineWidth: 4,
        strokeStyle: "#485563",
        joinstyle: "round",
        outlineColor: "#2b3e50",
        outlineWidth: 2
    },
    connectorHoverStyle = {
        lineWidth: 4,
        strokeStyle: "#528705",
        outlineWidth: 2,
        outlineColor: "#2b3e50"
    },
    endpointHoverStyle = {
        fillStyle: "#7AB02C",
        strokeStyle: "#7AB02C"
    },
    outputEndPoint = {
        endpoint: "Dot",
        anchor: [0, 0],
        paintStyle: {
            strokeStyle: "#528705",
            fillStyle: "transparent",
            radius: 7,
            lineWidth: 3
        },
        isSource: true,
        connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
        connectorStyle: connectorPaintStyle,
        hoverPaintStyle: endpointHoverStyle,
        connectorHoverStyle: connectorHoverStyle,
        dragOptions: {},
        maxConnections: 100
    },
    inputEndPoint = {
        endpoint: "Dot",
        anchor: [0, 0],
        paintStyle: { fillStyle: "#528705", radius: 11 },
        hoverPaintStyle: endpointHoverStyle,
        maxConnections: 1,
        dropOptions: { hoverClass: "hover", activeClass: "active" },
        isTarget: true
    };

export {connectorPaintStyle, connectorHoverStyle, endpointHoverStyle, outputEndPoint, inputEndPoint};
