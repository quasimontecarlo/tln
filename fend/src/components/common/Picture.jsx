import React, { useRef, useEffect, useId } from "react";
import seedrandom from "seedrandom";
import { isMobile } from "react-device-detect";

const Picture = ({ userId }) => {
    const rng = seedrandom(userId);

    const canvas = useRef();
    let ctx = null;

    useEffect(() => {
        const canvasEle = canvas.current;
        canvasEle.width = 128;
        canvasEle.height = 128;
        ctx = canvasEle.getContext("2d");
    }, []);

    useEffect(() => {

        const utils = { "pad": 10,
                        "spacing": 12,
                        "distx": 12,
                        "thickness": 2,
                        "many": 10,
        };
        const res = { "w" : canvas.current.width,
                      "h" : canvas.current.height,
        };

        //ctx.strokeStyle = "#434c5e";
        //ctx.lineCap = "round";
        //ctx.lineJoin = "round";
        //ctx.lineWidth = 1;
        //render(ctx, res, utils);
        rndr(ctx, res, utils);

    }, []);
    
    class CC {
        constructor(x, y, r) {
            this.x = x;
            this.y = y;
            this.r = r;
            this.growing = true;
            this.plist = [];
        };

        points(ctx, c, utils, allv) {
            let points = 0;
            if (c.r <= 2) {
                points = 1;
            } else if (c.r <= 5) {
                points = 4;
            } else if (c.r <= 10) {
                points = 8;
            } else {
                points = 10;
            }
            const arc = Math.PI*2 / points;
            let ang = 0;
            for(let i = 0; i < points; i++) {
                const x = c.r * Math.cos(ang) + (c.x);
                const y = c.r * Math.sin(ang) + (c.y);
                ctx.beginPath();
                ctx.lineWidth = utils.thickness;
                ctx.strokeStyle = "red";
                ctx.arc(x, y, 0.5, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.closePath();
                this.plist.push(new CC(x, y, 0.5));
                allv.push({x: x, y: y});
                ang += arc;
            };
        };

        edges(res, utils) {
            return (this.x + (this.r+(utils.thickness*2)) > res.w || this.x - (this.r+(utils.thickness*2)) < 0 ||
                this.y + (this.r+(utils.thickness*2)) > res.h || this.y - (this.r+(utils.thickness*2)) < 0)
        };

        grow() {
            if (this.growing) {
                this.r = this.r+1;
            };
        };
        

        draw(ctx, utils) {
            circle(ctx, this.x, this.y, this.r, utils);
        };
    };

    function rndr(ctx, res, utils) {
        const clist = [];
        const allv = [];
        const hullp = [];

        const frames = 500;

        for (let i = 0; i < utils.many; i++) {
            makeCircle(clist, res);
        };

        for (let i = 0; i < frames; i++) {
            clist.forEach(c => {
                if (c.edges(res, utils)) {
                    c.growing = false;
                } else {
                    clist.forEach(other => {
                        if (c != other) {
                            const d = dist(c.x, c.y, other.x, other.y);
                            if (d < (c.r+utils.thickness) + (other.r+utils.thickness)) {
                                c.growing = false;
                            };
                        };
                    });
                };
                c.grow();
            });
        };

        clist.forEach(c => {
            c.draw(ctx, utils);
        });
        clist.forEach(c => {
            c.points(ctx, c, utils, allv);
        });

        quickHull(allv, hullp);
        const shape = sortPs(hullp);
        drawBlob(shape, ctx);
    };

    function quickHull(allv, hullp){
        allv.sort(function(a,b){return a.x - b.x});

        let left = allv[0];
        let right = allv[allv.length-1];


        hullp.push(left);
        hullp.push(right);

        let spline1 = new makeLine(left, right);
        let spline2 = new makeLine(right, left);

        let splits = splitPoints(allv, spline1);

        findHull(splits[0], spline1, hullp);
        findHull(splits[1], spline2, hullp);
    };

    function makeLine(pt1, pt2){
        this.pt1 = pt1;
        this.pt2 = pt2;
    };

    function findHull(s, line, hullp) {
        if(s.length === 0) {
            return 0
        } else {
            let idx = findFurthest(s, line)
            
            hullp.push(s[idx]);

            let trline1 = new makeLine(line.pt1, s[idx]);
            let trline2 = new makeLine(s[idx], line.pt2);

            let trsplit1 = splitPoints(s, trline1);
            let trsplit2 = splitPoints(s, trline2);
            
            findHull(trsplit1[0], trline1, hullp);
            findHull(trsplit2[0], trline2, hullp);
        };
    };

    function dist2(v, w) {
        return ((v.x - w.x)*(v.x - w.x)) + ((v.y - w.y)*(v.y - w.y));
    };
      
    function distToSegment(p, v, w) {
        let l2 = dist2(v, w);
        if (l2 === 0) {
          return dist2(p, v);
           }
      
        var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
      
        t = Math.max(0, Math.min(1, t));

      
        return Math.sqrt(dist2(p, {
          x: v.x + t * (w.x - v.x),
          y: v.y + t * (w.y - v.y)
        }));
    };
      
    function distancePointLine(pt, line) {
        return distToSegment(pt, line.pt1, line.pt2)
    };

    function findFurthest(S, line) {
        let maxD = 0
        let idx = -1
        for (let n = 0; n < S.length; n++) {
          let d = distancePointLine(S[n], line);
          if (d > maxD) {
            maxD = d
            idx = n
          }
        }
      
        return idx
    };
    
    function sortPs(pts) {
        const center = pts.reduce((acc, {x, y}) => {
            acc.x += x / pts.length;
            acc.y += y / pts.length;
            return acc;
        }, {x: 0, y:0});

        const angles = pts.map(({x,y}) => {
            return { x, y, angle: Math.atan2(y - center.y, x - center.x) * 180 / Math.PI};
        });

        const ptsSort = angles.sort((a, b) => a.angle - b.angle);
        return ptsSort;
    };

    function splitPoints(pts, line){

        let s1 = [];
        let s2 = [];
        for (let n = 0; n < pts.length; n++) {
            let pt = pts[n];
            let d = (line.pt1.x - pt.x) * (line.pt2.y - pt.y) - (line.pt2.x - pt.x) * (line.pt1.y - pt.y);

            if (d < 0) {
                s1.push(pt);
            } else if ( d > 0) {
                s2.push(pt)
            };
        };
        return [s1, s2];
    };

    function makeCircle(clist, res) {
        const x = map(rng(), 0, 1, 0, res.w);
        const y = map(rng(), 0, 1, 0, res.h);
        let valid = true;

        clist.forEach(c => {
            const d = dist(x, y, c.x, c.y);
            if (d < c.r) {
                valid = false;
            };
            });
        if(valid) {
            return clist.push(new CC(x, y, 0.1));
        } else {
            return null;
        };
    };

    function drawBlob(pts, ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.moveTo(pts[0].x, pts[0].y);
        pts.forEach(pt => {
            ctx.lineTo(pt.x, pt.y);
        });
        ctx.lineTo(pts[0].x, pts[0].y);
        ctx.stroke();
        ctx.closePath();
    };

    function map(value, inMin, inMax, outMin, outMax) {
        return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
    };

    function dist(x, y, x1, y1) {
        return Math.sqrt(((x - x1)**2) + ((y - y1)**2));
    };

    function dottedLine(ctx, utils, rowyPos, disty, d, qty, axis, dots) {
        let x = utils.pad;
        let y = rowyPos;
        for(let i = 0; i < qty; i++) {

            if(!i){
                circle(ctx, x, y, d, utils);
                dots.push({x, y});
                continue
            };

            switch (axis) {
                case "x":
                    x = !utils.distx ? x + utils.pad : x + utils.distx;
                break;
                case "y":
                    y = !disty ? y + utils.pad : y + disty;
                break;
                case "xy":
                    x = !utils.distx ? x + utils.pad : x + utils.distx;
                    y = !disty ? y + utils.pad : y + disty;
                break;
            };

            circle(ctx, x, y, d, utils);
            dots.push({x,y});
        };
    };

    function dottedGrid(ctx, d, rowQty, numRows, utils, dots) { 
        for(let i = 0; i < numRows; i++) {
            let rowyPos = !i ? utils.pad : utils.pad + utils.spacing * i;
            dottedLine(ctx, utils, rowyPos, 0, d, rowQty, "x", dots);
        }
    };

    const many = (distance, axis, utils, res) => {
        return Math.floor(axis == "x"  ? (res.w) / distance : (res.h - utils.itemSize) / distance);
    };

    function rowQty(utils, res) {
        return many(utils.distx, "x", utils, res);
    };

    function numRows(utils, res) {
        return many(utils.spacing, "y", utils, res);
    };


    function circle(ctx, x, y, d, utils) {
        ctx.beginPath();
        ctx.lineWidth = utils.thickness;
        ctx.strokeStyle = "green";
        ctx.arc(x, y, d, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    };

    function gridMaker(divs) {
        const grid = [];
        for(let x = 0; x < divs; x++) {
            grid[x] = [];
            for(let y = 0; y < divs; y++) {
                grid[x][y] = {x, y, c: []};
            };
        };
        return grid
    };

    function render(ctx, res, utils) {
        let dots = [];
        let vtx = 50;
        let x = res.w/2;
        let y = res.h/2;
        let size = 2;
        const points = [];
        let index = Math.floor(rng()*dots.length);
        let angleStep = (Math.PI * 2 ) / vtx;


        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = utils.pad;
        ctx.rect(0, 0, res.w, res.h); 
        ctx.stroke();
        ctx.closePath();

        dottedGrid(ctx, utils.itemSize*2, rowQty(utils, res), numRows(utils, res), utils, dots);
        
        points.push({x,y});
        
        for(let i = 1; i <= vtx; i++){
            const pull = Math.floor(rng() +0.75 + 1 );

            x = x + Math.cos(i * angleStep) * (size * pull);
            y = y + Math.sin(i * angleStep) * (size * pull);

            points.push({ x, y });
        };
        points.push({x,y});

        bzCurve(points, 0.3, 1);
    };
    function gradient(a, b) { 
        return (b.y-a.y)/(b.x-a.x); 
    } 

    function bzCurve(points, f, t) { 
        if (typeof(f) == 'undefined') f = 0.3; 
        if (typeof(t) == 'undefined') t = 0.6; 
      
        ctx.beginPath(); 
        ctx.moveTo(points[0].x, points[0].y); 
      
        var m = 0; 
        var dx1 = 0; 
        var dy1 = 0;
        var dx2 = 0;
        var dy2 = 0; 
          
        var preP = points[0]; 
          
        for (var i = 1; i < points.length; i++) { 
            var curP = points[i]; 
            var nexP = points[i + 1]; 
            if (nexP) { 
                m = gradient(preP, nexP); 
                dx2 = (nexP.x - curP.x) * -f; 
                dy2 = dx2 * m * t; 
            } else { 
                dx2 = 0; 
                dy2 = 0; 
            } 
              
            ctx.bezierCurveTo( 
                preP.x - dx1, preP.y - dy1, 
                curP.x + dx2, curP.y + dy2, 
                curP.x, curP.y 
            ); 
          
            dx1 = dx2; 
            dy1 = dy2; 
            preP = curP; 
        }
        ctx.stroke();
        ctx.closePath();
        ctx.fill();
    } 

    return (
        <div className="h-[128px] w-[128px]">
                <canvas ref={canvas} />
        </div>
                
	);
};

export default Picture;