import React, { useRef, useEffect, useId } from "react";
import seedrandom from "seedrandom";

const Banner = ({ userId }) => {


    const rng = seedrandom(userId);

    const canvas = useRef();
    let ctx = null;

    useEffect(() => {
        const canvasEle = canvas.current;
        canvasEle.style.width = "100%";
        canvasEle.width = canvasEle.offsetWidth;
        canvasEle.height = 208;
        ctx = canvasEle.getContext("2d");
    }, []);

    useEffect(() => {

        const utils = { "margin": 0,
                        "len": 30,
                        "cellSize": 20,
        };
        const res = { "w" : canvas.current.width,
                      "h" : canvas.current.height,
        };

        ctx.strokeStyle = "#434c5e";
        ctx.lineCap = "round";
        ctx.lineWidth = 1;
        render(ctx, res, utils);

    }, []);


    class Particle {
        constructor(res) {
            this.x = rng() * res.w;
            this.y = rng() * res.h;

            this.speedx;
            this.speedy;
            this.speedMod = Math.floor(rng() * 5 + 1);

            this.history = [{x: this.x, y: this.y}];
            this.maxLength = Math.floor(rng() * 500 + 10);
            this.angle = rng();
        }
        draw(ctx){
            ctx.beginPath();
            ctx.moveTo(this.history[0].x, this.history[0].y);
            for (let i = 0; i < this.history.length; i++) {
                ctx.lineTo(this.history[i].x, this.history[i].y);
            }
            ctx.stroke();
        };

        update(utils, cols, flowField){
            let x = Math.floor(this.x / utils.cellSize);
            let y = Math.floor(this.y / utils.cellSize);
            let index = y * cols + x;
            this.angle = flowField[index];

            this.speedx = Math.cos(this.angle);
            this.speedy = Math.sin(this.angle);
            this.x += this.speedx * this.speedMod;
            this.y += this.speedy * this.speedMod;

            this.history.push({x: this.x, y: this.y});
            if (this.history.length > this.maxLength) {
                this.history.shift();
            }
        };
    };

    function render(ctx, res, utils) {
        let particles = [];
        const frames = 250;
        let rows = Math.floor(res.h / utils.cellSize);
        let cols = Math.floor(res.w / utils.cellSize);
        let flowField = [];
        let curve = rng() * 1.5 + 0.6;
        let zoom = rng() * 0.5 + 0.11;
        const numParticles = 300;

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let angle = (Math.cos(x * zoom) + Math.sin(y * zoom)) * curve;
                flowField.push(angle);
            }
        };

         for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle(res, utils));
        };
        for (let i = 1; i < frames; i++) {
            particles.forEach(particle => { particle.update(utils, cols, flowField);});
        };
        particles.forEach(particle => { particle.draw(ctx)});
    };


    return (
        <div className="flex items-center">
                <canvas ref={canvas} />
        </div>
                
	);
};

export default Banner;