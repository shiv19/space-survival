interface Spaceship {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Asteroid {
  x: number;
  y: number;
  radius: number;
}

export function checkCollision(spaceship: Spaceship, asteroid: Asteroid): boolean {
  const spaceshipCenterX = spaceship.x + spaceship.width / 2;
  const spaceshipCenterY = spaceship.y + spaceship.height / 2;

  const dx = asteroid.x - spaceshipCenterX;
  const dy = asteroid.y - spaceshipCenterY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const spaceshipRadius = (spaceship.width + spaceship.height) / 4;
  // Reduce the asteroid's effective hitbox radius by 20%
  const effectiveAsteroidRadius = asteroid.radius * 0.8;

  return distance < (effectiveAsteroidRadius + spaceshipRadius);
}
