import { BarcosInfo, User } from "../Class/User"

export const gameState = {
    you: new User(),
    enemi: new User(),
    infoBarcos: new BarcosInfo()
};

export const reset = () => {
    gameState.you.reset();
    gameState.enemi.reset();
    gameState.infoBarcos.reset();
};