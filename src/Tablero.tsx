import { useEffect, useState } from 'react'
import { User } from "./Class/User";
import { gameState } from './Constant/Jugadores';

interface Input {
    who: string;
    tableroInput: User
    inputTablero: string[][]
    setTurno: () => void
}


export default function Tablero({ who, tableroInput, inputTablero, setTurno }: Input) {
    const [tablero, setTablero] = useState(tableroInput.tablero)

    const actualizar = (x: number, y: number) => {
        let tmp
        tmp = tableroInput.edit(x, y)
        if (tmp) {
            gameState.infoBarcos.updatePartida()
            alert("Ha perdido el " + who)
        }
        setTablero([...tableroInput.tablero])
    }

    useEffect(() => {
        if (inputTablero) {
            setTablero(inputTablero)
        }
    }, [inputTablero, who])

    const colocarBarco = (x: number, y: number) => {
        tableroInput.addBarco(gameState.infoBarcos.getLongitud(), x, y, gameState.infoBarcos.getDireccion())
        setTablero([...tableroInput.tablero])
    }

    const secction = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

    return (
        <>
            <div className='displayFlex'>
                <p></p>
                {secction.map((_, posicio) => (
                    <p key={posicio}>{posicio + 1}</p>
                ))}
            </div>
            {tablero.map((line, lineIndex) => (
                <div key={lineIndex} className='displayFlex'>
                    <p key={lineIndex}>{secction[lineIndex]}</p>
                    {
                        line.map((recuadro, index) => {
                            return (<p key={index} className={recuadro} onClick={() => {
                                if (!recuadro.includes("T") && who != "player" && gameState.infoBarcos.getPartida()) {
                                    setTurno()
                                    actualizar(index, lineIndex)
                                }
                                if (who == "player" && gameState.infoBarcos.getLongitud() > 0) colocarBarco(index, lineIndex)
                            }}>{recuadro.includes("T") && "X"}</p>)
                        })
                    }
                </div >

            ))
            }
        </>
    )
}