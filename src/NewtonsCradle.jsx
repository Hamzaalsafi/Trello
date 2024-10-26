import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

const NewtonsCradle = () => {
  const sceneRef = useRef(null);

  useEffect(() => {
    const { Engine, Render, Runner, Body, Composite, Mouse, MouseConstraint, World, Bodies, Constraint } = Matter;
  
    const engine = Engine.create();
    const world = engine.world;
  
    const screenWidth = window.innerWidth < 700 ? window.innerWidth-window.innerWidth*.25 : 600;
    const screenHeight = window.innerHeight;
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: screenWidth,
        height: 700,
        wireframes: false,
        background: 'transparent',
      },
    });
  
    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);
    
    const balls = [];
    let hue = 0;
  
    const createBall = (x, y, size) => {
      const ball = Bodies.circle(x, y, size, {
        inertia: Infinity,
        restitution: 1,
        friction: 0,
        frictionAir: 0.0001,
        render: {
       
          fillStyle: `hsl(340, 100%, 70%)`,
          strokeStyle: 'rgb(220, 220, 220)',
          lineWidth: 2,
        }
      });
      return ball;
    };
  
    const createNewtonsCradle = (x, y, number, size, length) => {
      const cradle = Composite.create({ label: 'NewtonsCradle' });
      const spacing = size * 2;
  
      for (let i = 0; i < number; i++) {
        const ball = createBall(x + i * spacing, y + length, size);
  
        const constraint = Constraint.create({
          pointA: { x: x + i * spacing, y: y },
          bodyB: ball,
          pointB: { x: 0, y: 0 },
          length: length,
          stiffness: 0.9,
          render: {
            strokeStyle: 'rgb(220, 220, 220,1)',
            lineWidth: 1.5,
          },
        });
  
        Composite.addBody(cradle, ball);
        Composite.addConstraint(cradle, constraint);
        balls.push(ball);
      }
  
      return cradle;
    };
  
    // Calculate the total width of the cradle based on the number of balls and the spacing
    const numberOfBalls = 5;
    const ballSize = 21;
    const cradleWidth = (ballSize * 2) * numberOfBalls;
    const startX = (screenWidth / 2) - (cradleWidth / 2); // Center the cradle horizontally
  
    const cradle = createNewtonsCradle(startX, 135, numberOfBalls, ballSize, 175);
    World.add(world, cradle);
    Body.translate(cradle.bodies[0], { x: -140, y: -60 });
  
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    World.add(world, mouseConstraint);
    render.mouse = mouse;
  
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: screenWidth - 50, y: 700 },
    });
  
    const animateColors = () => {
      hue = (hue + 1) % 360;
      const fillColor = `hsl(340, 100%, ${70 + Math.sin(hue * 0.1) * 7}%)`;
      const strokeColor = `hsl(320, 100%, ${40 + Math.sin(hue * 0.1) * 7}%)`;
  
      balls.forEach(ball => {
        ball.render.fillStyle = fillColor;
        ball.render.strokeStyle = strokeColor;
      });
  
      setTimeout(() => {
        requestAnimationFrame(animateColors);
      }, 200);
    };
    
    animateColors();
  
   
    
  
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, []);

  return <div ref={sceneRef} style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }} />;
};

export default NewtonsCradle;
