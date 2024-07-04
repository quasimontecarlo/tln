import React, { useRef, useEffect, useId, act } from "react";
import seedrandom from "seedrandom";
import { createNoise3D } from "simplex-noise";
import Alea from "alea";
import { isMobile } from "react-device-detect";

const Banner = ({ userId }) => {

    const canvas = useRef();
    let ctx = null;


    const pnrg = new Alea(userId);
    const rng = seedrandom(userId);
    const noise3D = createNoise3D(pnrg);

    const randArray = (arr) => {
        return arr[Math.floor(pnrg() * arr.length)];
    };


    useEffect(() => {
        const canvasEle = canvas.current;
        canvasEle.style.width = "100%";
        canvasEle.style.height = "100%";
        //canvasEle.width = canvasEle.offsetWidth;
        canvasEle.width = 1152;
        if(isMobile){
            canvasEle.width = 559;
        }
        canvasEle.height = 208;
        ctx = canvasEle.getContext("2d");
    }, []);

    useEffect(() => {
        const utils = { "margin": 0,
            "len": 30,
            "cellSize": 20,
            // new implementation
            "maxscale": 0.001,
            "minscale": 0.00004,
            "maxspace": 30,
            "minspace": 1,
            "maxBiglinesize": 80,
            "maxSmalllinesize": 2,
            "minSmalllinesize": 1,
            "maxBiglines": 5,
            "maxMidlines": 20,
            "maxSmalllines": 85,
            "csize": 5,
        };
    
        const res = { "w" : canvas.current.width,
          "h" : canvas.current.height,
        };


        setup(ctx, res, utils);

    }, []);


    function setup (ctx, res, utils) {

        // new approach following this https://matthewstrom.com/writing/generative-art-og-images/
        const cellBetween = pnrg() * (utils.maxspace - utils.minspace) + utils.minspace;
        const noiseScale = pnrg() * (utils.maxscale - utils.minscale) + utils.minscale;
        const cols = Math.ceil(res.w / utils.csize);
        const rows = Math.ceil(res.h / utils.csize);
        const grid = [... new Array(cols * rows)].map(() => []);
        const activeList = [];
        const distance = ([x1, y1], [x2, y2]) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

        const vectorAtPoint = ([x, y], cartesian = true) => {
            const angle = (1 + noise3D(x * noiseScale, y * noiseScale, 0)) * Math.PI;
            const magnitude = utils.csize * 1.5;
            return cartesian
                    ? radialToCart(magnitude, angle) : [magnitude, angle];
        };

        const radialToCart = (magnitude, angle) => [
            Math.cos(angle) * magnitude,
            Math.sin(angle) * magnitude,
        ];

        const coordsToIndex = ([i, j]) => i + j * cols;

        const gridCellAtPoint = ([x, y]) => [
            Math.floor(x / utils.csize),
            Math.floor(y / utils.csize),
        ];

        const gridIndexAtPoint = (point) => {
            const [x, y] = gridCellAtPoint(point);
            return coordsToIndex([x, y]);
        };

        const addPointToGrid = (point) => {
            grid[gridIndexAtPoint(point)].push(point);
        };

        const closeNeighborsToPoint = (point) =>
            pointsNeighboringCells(point).filter((neighbor) => distance(neighbor, point) < utils.csize);
    
        const pointsNeighboringCells = (point) => {
            const [i, j] = gridCellAtPoint(point);
            const neighbors = [];
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if (
                        i + x >= 0 &&
                        i + x <= cols &&
                        j + y >= 0 &&
                        j + y <= rows
                    ) {
                        const neighbor = grid[coordsToIndex([i + x, j + y ])];
                        if (neighbor) {
                            neighbors.push(neighbor);
                        };
                    };
                };
            };
            return neighbors.flat();
        };
    
        const pointHasCloseNeighbors = (point) => closeNeighborsToPoint(point).length !== 0;

        const pointIsOutsideCanvas = ([x, y]) => {
            return (
                x < 0 + utils.margin ||
                x > res.w - utils.margin ||
                y < 0 + utils.margin ||
                y > res.h - utils.margin
            );
        };

        const randomPointInRect = () => {
            return [pnrg() * res.w, pnrg() * res.h];
        };

        const pointPairNormalToLineAtPoint = ([x, y]) => {
            const theta = vectorAtPoint([x, y], false)[1];
            const normal = radialToCart(utils.csize, theta + Math.PI / 2);
            const antiNormal = radialToCart(utils.csize, theta - Math.PI / 2);
            const pointAbove = [x + normal[0], y + normal[1]];
            const pointBelow = [x + antiNormal[0], y + antiNormal[1]];
            return [pointAbove, pointBelow];
        }; 
        
        const drawFlowLines = (
            seedPoint = randomPointInRect(), lineWidth = 1
        ) => {
            activeList.push(seedPoint);
            while (activeList.length > 0) {
                let point = activeList.pop();
                if (closeNeighborsToPoint(point, 1).length > 0) {
                    continue;
                } else {
                    drawFlowLine(point, lineWidth);
                };
            };
        };

        const drawFlowLine = (
            currentPoint, lineSize = 1, direction = -1, line = [], splines = []
        ) => {
            if (line.length === 0) {
                line.push(currentPoint);
                const firstSpline = [currentPoint];
                for (let i = 0.5; i <= Math.ceil(lineSize / 2) + cellBetween; i++) {
                    for (const normalPoint of pointPairNormalToLineAtPoint(currentPoint, i * utils.csize)) {
                        
                        if (!pointIsOutsideCanvas(normalPoint)) {
                            addPointToGrid(normalPoint);
                            firstSpline.push(normalPoint);
                        };
                    };
                };
                splines.push(firstSpline);
            };

            const currentVector = vectorAtPoint(currentPoint);
            const nextPoint = [
                currentPoint[0] + currentVector[0] * direction,
                currentPoint[1] + currentVector[1] * direction,
            ];

            const nextSpline = [nextPoint];

            for (let i = 0.5; i <= Math.ceil(lineSize / 2 + 1); i++) {
                for (const normalPoint of pointPairNormalToLineAtPoint(
                    nextPoint, i * utils.csize
                )) {
                    nextSpline.push(normalPoint);
                };
            };
            
            if ( nextSpline.some(pointIsOutsideCanvas) || nextSpline.some(pointHasCloseNeighbors)) {
                if (direction === -1) {
                    line.reverse();
                    splines.reverse();
                    direction = 1;

                    drawFlowLine(line[line.length - 1], lineSize, direction, line, splines);
                } else {
                    ctx.lineWidth = utils.csize * lineSize;
                    ctx.strokeStyle = "#434c5e";
                    ctx.beginPath();
                    ctx.moveTo(...line[0]);
                    for (let i = 1; i < line.length; i++) {
                        ctx.lineTo(...line[i]);
                    };
                    ctx.stroke();
                };
            } else {
                nextSpline.map((p) => {
                    addPointToGrid(p);
                });
                line.push(nextPoint);
                if (line.length % 4 === 0) {
                    for (const normalPoint of pointPairNormalToLineAtPoint(currentPoint, lineSize * utils.csize + 2 * cellBetween * utils.csize)) {
                        if (!pointIsOutsideCanvas(normalPoint)) {
                            activeList.push(normalPoint);
                        };
                    };
                };
                drawFlowLine(nextPoint, lineSize, direction, line, splines);
            };
        };


        //run

        const BIGLINESIZE = pnrg() * utils.maxBiglinesize;
        // draw big lines
        /*
        for (let i = 0; i < pnrg() * utils.maxBiglines; i++) {
            drawFlowLine(randomPointInRect(), BIGLINESIZE);
        }
        for (let i = 0; i < pnrg() * utils.maxMidlines; i++) {
            drawFlowLine(randomPointInRect(), BIGLINESIZE / 3);
        }
        for (let i = 0; i < pnrg() * utils.maxSmalllines; i++) {
            drawFlowLine(randomPointInRect(), BIGLINESIZE / 6);
        }
        */
        for (let i = 0; i < utils.maxSmalllines; i++) {
            const SMALLLINESIZE = Math.round(pnrg() * (utils.maxSmalllinesize - utils.minSmalllinesize) + utils.minSmalllinesize);

            drawFlowLines(randomPointInRect(), SMALLLINESIZE);
        }

    };

    return (
        <div className="h-52">
                <canvas ref={canvas} />
        </div>
                
	);
};

export default Banner;