import {getLatestObjkt} from './repository.js'

async function analyseObjkt(){
    const latestObjktPurchases = await getLatestObjkt()
    for (const objkt of latestObjktPurchases) {
        console.log(objkt.fa_contract)
        console.log(objkt.token.token_id)
    }
}

analyseObjkt()