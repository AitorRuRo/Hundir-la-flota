import { useState, useEffect } from 'react';
import { gameState } from './Constant/Jugadores';
import { updatePlaced } from './Almacen';

export const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const [dirs, setDirs] = useState([64, 0, 1, 0]);
    const spacing = 64;
    const offset = ((gameState.infoBarcos.getLongitud() - 1) * spacing) / 2;

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'r') {
                setDirs((currentDirs) => {
                    if (currentDirs[0] === 0) {
                        gameState.infoBarcos.updateDireccion(0)
                        return [64, 0, 1, 0];
                    } else {
                        gameState.infoBarcos.updateDireccion(1)
                        return [0, 64, 0, 1];
                    }
                });
            } else if (e.key.toLowerCase() === "escape") {
                gameState.infoBarcos.updateLongitud(0)
                updatePlaced()
            }

        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const elements = Array.from({ length: gameState.infoBarcos.getLongitud() });

    return (
        <>
            {elements.map((_, index) => (
                <p
                    key={index}
                    className='B cursor'
                    style={{
                        transform: `translate(
                            ${position.x - (offset * dirs[2]) + (index * dirs[0])}px, 
                            ${position.y - (offset * dirs[3]) + (index * dirs[1])}px
                        )`,
                        transition: `transform 0.1s ease-out`,
                    }}
                >
                </p>
            ))}
        </>
    );
};