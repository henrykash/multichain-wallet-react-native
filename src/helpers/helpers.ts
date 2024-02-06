import { ethers } from "ethers";

class Helpers {
  constructor() {}

    shuffleArray =(origin: any) =>{
    let array = origin.slice();
    return ethers.utils.shuffled(array);
}
}

export const HelpersWrapper = new Helpers();
