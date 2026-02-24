import { useEffect, useState } from 'react'
import { gameState } from './Constant/Jugadores'

interface Input {
    visible: boolean
}

let placedTmp: number[] = []

export const updatePlaced = () => window.dispatchEvent(new CustomEvent("actualiza"));

export default function Almacen({ visible }: Input) {
    const [open, setOpen] = useState(false)
    const [isSelected, setIsSelected] = useState(7)
    const [placed, setPlaced] = useState<number[]>([])
    const seleccionar = (input: number) => {
        gameState.infoBarcos.updateWho(input);
        setIsSelected(gameState.infoBarcos.getWho())
    }

    useEffect(() => {
        const refrescarDatos = () => {
            setPlaced(gameState.infoBarcos.getPlaced());
            setIsSelected(7)
        };

        window.addEventListener('actualiza', refrescarDatos);

        return () => {
            window.removeEventListener('actualiza', refrescarDatos);
        };
    }, []);

    return (
        <div className={visible ? "displayNone" : 'zonaAlmacen displayFlex'}>
            <h1 onClick={() => setOpen(!open)}>Almacen de barcos</h1>
            <div className={open ? "displayFlex almacen" : "displayNone"}>
                <div className={`${isSelected == 0 ? "seleccted" : ""} ${placed.includes(0) ? "colocado" : ""}  Portaviones`} onClick={() => {
                    if (placed.includes(0)) return
                    gameState.infoBarcos.updateLongitud(5);
                    seleccionar(0);
                }}></div>
                <div className={`${isSelected == 1 ? "seleccted" : ""} ${placed.includes(1) ? "colocado" : ""} Acorazado`} onClick={() => {
                    if (placed.includes(1)) return
                    gameState.infoBarcos.updateLongitud(4);
                    seleccionar(1);
                }}></div>
                <div className={`${isSelected == 2 ? "seleccted" : ""} ${placed.includes(2) ? "colocado" : ""} Destructor`} onClick={() => {
                    if (placed.includes(2)) return
                    gameState.infoBarcos.updateLongitud(3);
                    seleccionar(2);
                }}></div>
                <div className={`${isSelected == 3 ? "seleccted" : ""} ${placed.includes(3) ? "colocado" : ""} Destructor`} onClick={() => {
                    if (placed.includes(3)) return
                    gameState.infoBarcos.updateLongitud(3);
                    seleccionar(3);
                }}></div>
                <div className={`${isSelected == 4 ? "seleccted" : ""} ${placed.includes(4) ? "colocado" : ""} Fragata`} onClick={() => {
                    if (placed.includes(4)) return
                    gameState.infoBarcos.updateLongitud(2);
                    seleccionar(4);
                }}></div>
            </div>
        </div>
    )
}