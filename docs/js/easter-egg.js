document.addEventListener('keydown', function(e) {
    if (e.key.toLowerCase() === 'm') {
        createStarfieldEffect();
    }
});

function createStarfieldEffect() {
    const canvas = document.createElement('canvas');
    const overlay = document.createElement('div');
    
    // Setup overlay
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
    overlay.style.zIndex = '9999';
    overlay.style.transition = 'opacity 0.5s';
    overlay.appendChild(canvas);
    document.body.appendChild(overlay);

    // Setup canvas
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    const stars = [];
    const numStars = 400;
    let speed = 2;
    
    // Mouse position
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    
    // Rocket position and rotation
    let rocketX = canvas.width / 2;
    let rocketY = canvas.height / 2;
    let rocketAngle = 0;
    const rocketSpeed = 0.1; // Smoothing factor for movement
    
    // Update mouse position
    canvas.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Star class
    class Star {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = (Math.random() - 0.5) * canvas.width;
            this.y = (Math.random() - 0.5) * canvas.height;
            this.z = Math.random() * 2000;
            
            // Random color between white and blue
            const hue = Math.random() * 60 + 200; // 200-260 for blue range
            this.color = `hsl(${hue}, 80%, 80%)`;
            this.size = Math.random() * 2;
        }
        
        update() {
            this.z -= speed;
            
            if (this.z <= 0) {
                this.reset();
            }
            
            // Project 3D coordinates to 2D
            const factor = 400 / this.z;
            const x2d = this.x * factor + canvas.width / 2;
            const y2d = this.y * factor + canvas.height / 2;
            
            // Draw star
            if (x2d >= 0 && x2d <= canvas.width && y2d >= 0 && y2d <= canvas.height) {
                const size = (1 - this.z / 2000) * 3;
                ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Create initial stars
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }

    function drawRocket(x, y, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Engine flame effect
        const flameGradient = ctx.createLinearGradient(-35, 0, -20, 0);
        flameGradient.addColorStop(0, 'rgba(255, 50, 0, 0)');
        flameGradient.addColorStop(0.5, 'rgba(255, 150, 0, 0.8)');
        flameGradient.addColorStop(1, 'rgba(255, 200, 0, 1)');
        
        ctx.beginPath();
        ctx.moveTo(-20, -5);
        ctx.lineTo(-35, 0);
        ctx.lineTo(-20, 5);
        ctx.fillStyle = flameGradient;
        ctx.fill();

        // Rocket body gradient
        const bodyGradient = ctx.createLinearGradient(-20, 0, 20, 0);
        bodyGradient.addColorStop(0, '#CC2222');
        bodyGradient.addColorStop(0.5, '#FF4444');
        bodyGradient.addColorStop(1, '#CC2222');

        // Main rocket body
        ctx.beginPath();
        ctx.moveTo(-20, -10);
        ctx.lineTo(20, 0);
        ctx.lineTo(-20, 10);
        ctx.closePath();
        ctx.fillStyle = bodyGradient;
        ctx.fill();
        
        // Body highlight
        ctx.beginPath();
        ctx.moveTo(-15, -7);
        ctx.lineTo(15, -2);
        ctx.lineTo(15, 2);
        ctx.lineTo(-15, 7);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();

        // Cockpit gradient
        const cockpitGradient = ctx.createRadialGradient(5, -2, 1, 5, -2, 8);
        cockpitGradient.addColorStop(0, '#AADDFF');
        cockpitGradient.addColorStop(0.5, '#7799FF');
        cockpitGradient.addColorStop(1, '#4466DD');

        // Cockpit
        ctx.beginPath();
        ctx.arc(5, 0, 6, 0, Math.PI * 2);
        ctx.fillStyle = cockpitGradient;
        ctx.fill();
        
        // Cockpit highlight
        ctx.beginPath();
        ctx.arc(3, -2, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();

        // Wing details
        ctx.beginPath();
        ctx.moveTo(-15, -8);
        ctx.lineTo(-10, -8);
        ctx.lineTo(-10, -12);
        ctx.closePath();
        ctx.fillStyle = '#CC2222';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-15, 8);
        ctx.lineTo(-10, 8);
        ctx.lineTo(-10, 12);
        ctx.closePath();
        ctx.fillStyle = '#CC2222';
        ctx.fill();

        // Engine details
        ctx.beginPath();
        ctx.arc(-18, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#991111';
        ctx.fill();

        ctx.restore();
    }

    let isActive = true;

    function draw() {
        if (!isActive) return;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => star.update());
        
        // Update rocket position and rotation
        const dx = mouseX - rocketX;
        const dy = mouseY - rocketY;
        rocketX += dx * rocketSpeed;
        rocketY += dy * rocketSpeed;
        rocketAngle = Math.atan2(dy, dx);
        
        // Draw rocket
        drawRocket(rocketX, rocketY, rocketAngle);

        requestAnimationFrame(draw);
    }

    // Start animation
    draw();

    // Speed control with arrow keys
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp' && speed < 10) {
            speed += 0.5;
        } else if (e.key === 'ArrowDown' && speed > 0.5) {
            speed -= 0.5;
        } else if (e.key.toLowerCase() === 'e') {
            isActive = false;
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 500);
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === 'y') {
            isActive = false;
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 500);        }
    });
    
    overlay.addEventListener('click', () => {
        isActive = false;
        overlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 500);
    });
}