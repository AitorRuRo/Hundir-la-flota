import { updatePlaced } from "../Almacen"
import { gameState } from "../Constant/Jugadores"

export class User {
    tablero: string[][] = [
        ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
        ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
        ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
        ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
        ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
        ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
        ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
        ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
        ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
        ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"]
    ];
    cordsBarcos: number[][] = []
    cordsBarcosTocados: number[][] = []
    edit(x: number, y: number) {
        if (this.esta([y, x])) {
            this.tablero[y][x] = "BT"
            this.cordsBarcosTocados.push([y, x])
            this.cordsBarcos = this.cordsBarcos.sort()
            this.cordsBarcosTocados = this.cordsBarcosTocados.sort()
            if (this.cordsBarcos.length == this.cordsBarcosTocados.length) return true
        }
        else this.tablero[y][x] += "T"
        return false
    }
    addBarco(size: number, x: number, y: number, direction: number) {
        if (this.esta([y, x])) return
        const totalSize = size
        if (size % 2 == 1) size--
        size = size / 2
        let posibleColocar = true
        let cordsTmp = [[y, x]]
        if (direction == 0) {
            if (x - size < 0) {
                if (totalSize != 2) {
                    alert("El barco no cabe porque sobresaldria por la izquierda " + size)
                    return
                }
            } else if (x + size > 9) {
                alert("El barco no cabe porque sobresaldria por la derecha")
                return
            }
            if (totalSize == 2) {
                if (this.tablero[y][x + 1] != "W" && this.esta([y, x + 1])) posibleColocar = false
                else cordsTmp.push([y, x + 1])
            }
            else {
                for (let i = 1; i <= size; i++) {
                    if (this.tablero[y][x - i] != "W" && this.esta([y, x - i])) {
                        posibleColocar = false
                        break
                    } else if (this.tablero[y][x + i] != "W" && this.esta([y, x + i])) {
                        posibleColocar = false
                        break
                    }
                    cordsTmp.push([y, x + i])
                    if (totalSize == 4 && i == 2) continue
                    cordsTmp.push([y, x - i])
                }
            }
        } else {
            if (y - size < 0) {
                alert("El barco no cabe porque sobresaldria por arriba")
                return
            } else if (y - size > 9) {
                alert("El barco no cabe porque sobresaldria por abajo")
                return
            }
            if (totalSize == 2) {
                if (this.tablero[y + 1][x] != "W" && this.esta([y + 1, x])) posibleColocar = false
                else cordsTmp.push([y + 1, x])
            }
            else {
                for (let i = 1; i <= size; i++) {
                    if (this.tablero[y - i][x] != "W" && this.esta([y - i, x])) {
                        posibleColocar = false
                        break
                    } else if (this.tablero[y + i][x] != "W" && this.esta([y + i, x])) {
                        posibleColocar = false
                        break
                    }
                    cordsTmp.push([y + i, x])
                    if (totalSize == 4 && i == 2) continue
                    cordsTmp.push([y - i, x])
                }
            }
        }
        if (posibleColocar) {
            this.cordsBarcos.push(...cordsTmp)
            for (let tmp of cordsTmp) this.tablero[tmp[0]][tmp[1]] = "B"
            gameState.infoBarcos.updateLongitud(0)
            gameState.infoBarcos.addPlaced(gameState.infoBarcos.getWho())
        }

    }
    esta(input: number[]) {
        if (this.cordsBarcos.some(seleccionado => JSON.stringify(seleccionado) == JSON.stringify(input))) return true
        return false
    }
    reset() {
        this.tablero = [
            ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
            ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
            ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
            ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
            ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
            ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
            ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
            ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
            ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
            ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W"]
        ];
        this.cordsBarcos = []
        this.cordsBarcosTocados = []
    }
    random() {
        if (this.cordsBarcos.length != 0) return
        const isOccupied = (x: number, y: number) => {
            return this.cordsBarcos.some(coord => coord[0] === x && coord[1] === y);
        };

        const colocarBarco = (tamano: number) => {
            while (true) {
                let x = Math.floor(Math.random() * 8) + 1;
                let y = Math.floor(Math.random() * 8) + 1;
                let direccion = Math.round(Math.random());

                let nuevasCoords = [];
                let error = false;

                for (let i = 0; i < tamano; i++) {
                    let nuevax = direccion === 0 ? x : x + (i - Math.floor(tamano / 2));
                    let nuevay = direccion === 0 ? y + (i - Math.floor(tamano / 2)) : y;

                    if (nuevax < 0 || nuevay > 9 || nuevay < 0 || nuevay > 9 || isOccupied(nuevax, nuevay)) {
                        error = true;
                        break;
                    }
                    nuevasCoords.push([nuevax, nuevay]);
                }

                if (!error) {
                    this.cordsBarcos.push(...nuevasCoords);
                    break
                }
            }
        };

        colocarBarco(5);
        colocarBarco(4);
        colocarBarco(3);
        colocarBarco(3);
        colocarBarco(2);
    }
}

export class BarcosInfo {
    private longitud: number = 0
    private direccion: number = 0
    private who: number = 7
    private placed: number[] = []
    private partida: boolean = false
    getLongitud() {
        return this.longitud
    }
    getDireccion() {
        return this.direccion
    }
    getWho() {
        return this.who
    }
    getPlaced() {
        return this.placed
    }
    getPartida() {
        return this.partida
    }
    updateLongitud(input: number) {
        this.longitud = input
    }
    updateDireccion(input: number) {
        this.direccion = input
    }
    updateWho(input: number) {
        this.who = input
    }
    updatePartida() {
        this.partida = !this.partida
    }
    addPlaced(input: number) {
        if (this.placed.includes(input)) return
        this.placed = [...this.placed, input]
        updatePlaced()
    }
    deletePlaced(input: number) {
        this.placed.filter((tmp) => tmp != input)
        updatePlaced()
    }
    reset() {
        this.longitud = 0
        this.direccion = 0
        this.who = 7
        this.placed = []
        this.partida = false
    }
}