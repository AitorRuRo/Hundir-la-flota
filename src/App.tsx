import { useEffect, useRef, useState } from 'react'
import './App.css'
import { gameState, reset } from './Constant/Jugadores'
import { CustomCursor } from './BarcoSelect'
import Almacen, { updatePlaced } from './Almacen'
import { User } from './Class/User'
import Tablero from './Tablero'

export default function App() {
  const [turno, setTurno] = useState<boolean>(true)
  const [player, setPlayer] = useState<User>(gameState.you)
  const [tablero, setTablero] = useState(gameState.you.tablero)
  const [tableroEnemigo, setTableroEnemigo] = useState(gameState.enemi.tablero)
  const [partida, setPartida] = useState<boolean>(gameState.infoBarcos.getPartida())

  const num = useRef<number>(1)
  const ronda = useRef<number>(0)
  const directions = useRef<boolean[]>([true, true, true, true])
  const cords = useRef<number[]>(null)

  useEffect(() => {
    if (turno) return;

    const esValido = (x: number, y: number) => x >= 0 && x <= 9 && y >= 0 && y <= 9;

    let targetX: number = -1;
    let targetY: number = -1;
    let encontrado: boolean = false;

    if (cords.current === null) {
      while (true) {
        const tmpX = Math.floor(Math.random() * 10);
        const tmpY = Math.floor(Math.random() * 10);
        if (!gameState.you.tablero[tmpY][tmpX].includes("T")) {
          targetX = tmpX;
          targetY = tmpY;
          encontrado = true;
          break;
        }
      }
    }
    else {
      while (true) {
        console.log(cords.current);
        console.log(directions.current);
        if (!directions.current[0] && !directions.current[1] && !directions.current[2] && !directions.current[3]) {
          cords.current = null;
          ronda.current = 0;
          num.current = 1;
          directions.current = [true, true, true, true];
          break;
        }
        if (cords.current == null) break
        if (!directions.current[ronda.current]) {
          ronda.current = (ronda.current + 1) % 4;
          num.current = 1;
          continue;
        }

        let tmpX = cords.current[0];
        let tmpY = cords.current[1];

        if (ronda.current === 0) tmpX -= num.current;
        if (ronda.current === 1) tmpY += num.current;
        if (ronda.current === 2) tmpX += num.current;
        if (ronda.current === 3) tmpY -= num.current;

        if (esValido(tmpX, tmpY)) {
          if (gameState.you.tablero[tmpY][tmpX].includes("T")) {
            if (gameState.you.tablero[tmpY][tmpX].includes("B")) {
              num.current++;
              continue;
            } else {
              directions.current[ronda.current] = false;
              ronda.current = (ronda.current + 1) % 4;
              num.current = 1;
            }
          } else {
            targetX = tmpX;
            targetY = tmpY;
            encontrado = true;
            break;
          }
        } else {
          directions.current[ronda.current] = false;
          ronda.current = (ronda.current + 1) % 4;
          num.current = 1;
        }
      }
    }

    if (encontrado && esValido(targetX, targetY)) {
      let enemi = gameState.you.edit(targetX, targetY);
      if (enemi) {
        alert("Has perdido el enemigo gano")
        setTurno(true)
        gameState.infoBarcos.updatePartida()
        return
      }
      if (gameState.you.tablero[targetY][targetX].includes("B")) {
        if (cords.current === null) {
          cords.current = [targetX, targetY];
          ronda.current = 0;
          num.current = 1;
        } else {
          num.current++;
          //Idea de la ia, antes lo tenia en 2 if
          const esHorizontal = (ronda.current === 0 || ronda.current === 2);
          directions.current[esHorizontal ? 1 : 0] = false;
          directions.current[esHorizontal ? 3 : 2] = false;
        }
      } else {
        if (cords.current !== null) {
          directions.current[ronda.current] = false;
          ronda.current = (ronda.current + 1) % 4;
          num.current = 1;
        }
      }
      let newPlayer = new User
      newPlayer = gameState.you
      setPlayer(newPlayer);
      setTablero(newPlayer.tablero)
    }

    setTurno(true);

  }, [turno]);

  useEffect(() => {
    setPartida(gameState.infoBarcos.getPartida())
  }, [gameState.infoBarcos.getPartida()])

  const turnoEnemy = () => setTurno(false);

  const resetAll = () => {
    reset();
    setTablero(gameState.you.tablero)
    setTableroEnemigo(gameState.enemi.tablero)
    updatePlaced()
  }

  return (
    <section className='displayFlex alignStart pantalla'>
      <CustomCursor />
      <section>
        <h1 className='textCenter'>Tu tablero</h1>
        <div className='tablero'>
          <Tablero who={"player"} tableroInput={player} setTurno={turnoEnemy} inputTablero={tablero} />
        </div>
      </section>
      <div>
        <div className='zoneButtons displayFlex'>
          <button className={partida ? "displayNone" : ""} onClick={() => {
            if (gameState.infoBarcos.getPlaced().length === 5 && !gameState.infoBarcos.getPartida()) {
              gameState.enemi.random();
              gameState.infoBarcos.updatePartida();
              setPartida(gameState.infoBarcos.getPartida())
            } else {
              alert("Tienes que colocar todos los barcos. Llevas: " + gameState.infoBarcos.getPlaced().length);
            }
          }}>Iniciar partida</button>

          <button className={partida ? "displayNone" : ""} onClick={() => {
            resetAll()
          }}>
            Resetear
          </button>
        </div>
        <Almacen visible={partida} />
      </div>
      <section>
        <h1 className='textCenter'>Tablero enemigo</h1>
        <Tablero who={"enemi"} tableroInput={gameState.enemi} setTurno={turnoEnemy} inputTablero={tableroEnemigo} />
      </section>
    </section>
  );
}