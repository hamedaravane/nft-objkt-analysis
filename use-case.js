import {getLatestObjkt, getObjktDetails} from './repository.js'

async function analyseObjkt() {
    const latestObjktPurchases = await getLatestObjkt()
    for (const objkt of latestObjktPurchases) {
        // let tempArray = await getObjktDetails(objkt.fa_contract, objkt.token.token_id)
        // console.log(checkAvailability(tempArray))
    }
}

const mockData = await getObjktDetails('KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton', 131391);

function checkIfIBought(list) {
    for (const listElement of list) {
        if (listElement.recipient_address === 'tz1ibW4sjBmVJEuCnaBzqRcvrU5mzNJfd9Ni' && listElement.event_type === 'transfer') {
            return true
        }
    }
    return false
}

function checkAvailability(history) {
    if (amountOfListEdition(history) > 1){
        if (amountOfListEdition(history) > amountOfSoldEdition(history)){
            return true;
        }
    }
    return false
}

function amountOfListEdition(history){
    let amountOfList = 0;
    let artist = findArtist(history);
    for (const historyElement of history) {
        if (historyElement.event_type_deprecated === 'list' && artist === historyElement.creator_address){
            amountOfList += historyElement.amount;
        }
    }
    return amountOfList;
}

function amountOfSoldEdition(history){
    let iterator = 0;
    for (const historyElement of history) {
        if (historyElement.event_type === 'transfer' && historyElement.event_type_deprecated === 'transfer'){
            iterator++;
        }
    }
    return iterator;
}

function findArtist(history){
    let artist = '';
    for (const historyElement of history) {
        if (historyElement.event_type_deprecated === 'list'){
            artist = historyElement.creator_address;
            return artist;
        }
    }
}

function collectRate(history){
    for (const historyElement of history) {
        let date = new Date(historyElement.timestamp)
        console.log(date.getTime())
    }
}

// collectRate(mockData)
// console.log(amountOfSoldEdition(mockData))
// console.log(amountOfListEdition(mockData))
// console.log(findArtist(mockData))
// console.log(tempArray)
// analyseObjkt()