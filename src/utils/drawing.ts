interface Spaceship {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface Asteroid {
  x: number;
  y: number;
  radius: number;
}

export function drawSpaceship(ctx: CanvasRenderingContext2D, spaceship: Spaceship) {
  ctx.save();
  ctx.translate(spaceship.x + spaceship.width / 2, spaceship.y + spaceship.height / 2);
  ctx.rotate(spaceship.rotation);
  
  // Draw the spaceship
  ctx.beginPath();
  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 2;
  
  // Enhanced triangle shape with thrusters
  ctx.moveTo(0, -spaceship.height / 2);
  ctx.lineTo(-spaceship.width / 2, spaceship.height / 2);
  ctx.lineTo(-spaceship.width / 4, spaceship.height / 4);
  ctx.lineTo(0, spaceship.height / 3);
  ctx.lineTo(spaceship.width / 4, spaceship.height / 4);
  ctx.lineTo(spaceship.width / 2, spaceship.height / 2);
  ctx.closePath();
  
  ctx.stroke();

  // Add a cockpit detail
  ctx.beginPath();
  ctx.arc(0, 0, spaceship.width / 6, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.restore();
}

export function drawAsteroid(ctx: CanvasRenderingContext2D, asteroid: Asteroid) {
  ctx.beginPath();
  ctx.strokeStyle = '#ff0000';
  ctx.lineWidth = 2;
  
  // Create a more detailed irregular asteroid
  ctx.beginPath();
  const points = 12;
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const variance = 0.3; // How irregular the asteroid shape is
    const radius = asteroid.radius * (1 + Math.sin(angle * 3) * variance);
    const x = asteroid.x + Math.cos(angle) * radius;
    const y = asteroid.y + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.closePath();
  ctx.stroke();

  // Add some detail lines inside the asteroid
  const innerLines = 2;
  for (let i = 0; i < innerLines; i++) {
    const angle = Math.random() * Math.PI * 2;
    const length = asteroid.radius * 0.8;
    ctx.beginPath();
    ctx.moveTo(
      asteroid.x + Math.cos(angle) * length * 0.3,
      asteroid.y + Math.sin(angle) * length * 0.3
    );
    ctx.lineTo(
      asteroid.x + Math.cos(angle) * length,
      asteroid.y + Math.sin(angle) * length
    );
    ctx.stroke();
  }
}