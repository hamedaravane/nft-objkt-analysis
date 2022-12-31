import {getLatestObjkt, getObjktDetails} from './repository.js'

async function analyseObjkt() {
    const latestObjktPurchases = await getLatestObjkt()
    for (const objkt of latestObjktPurchases) {
        let tempArray = await getObjktDetails(objkt.fa_contract, objkt.token.token_id)
        if (checkIfIBought(tempArray)) {
            if (checkAvailability(tempArray)) {
                console.log(collectRate(tempArray))
                console.log('https://objkt.com/asset/' + tempArray[0].fa_contract + '/' + tempArray[0].token.token_id)
            }
        }
    }
}

// const mockData = await getObjktDetails('KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton', 131391);

function checkIfIBought(list) {
    for (const listElement of list) {
        if (listElement.recipient_address === 'tz1ibW4sjBmVJEuCnaBzqRcvrU5mzNJfd9Ni' && listElement.event_type === 'transfer') {
            return false
        }
    }
    return true
}

function getListOfPurchaseTimestamps(history) {
    let purchaseTimestamps = [];
    for (const historyElement of history) {
        if (historyElement.event_type_deprecated === 'ask_purchase') {
            let date = new Date(historyElement.timestamp).getTime();
            purchaseTimestamps.push(date);
        }
    }
    return purchaseTimestamps;
}

function checkAvailability(history) {
    if (amountOfListEdition(history) > 1) {
        if (amountOfSoldEdition(history) > 2){
            if (amountOfListEdition(history) > amountOfSoldEdition(history)) {
                return true;
            }
        }
    }
    return false
}

function amountOfListEdition(history) {
    let amountOfList = 0;
    let artist = findArtist(history);
    for (const historyElement of history) {
        if (historyElement.event_type_deprecated === 'list' && artist === historyElement.creator_address) {
            amountOfList += historyElement.amount;
        }
    }
    return amountOfList;
}

function amountOfSoldEdition(history) {
    let iterator = 0;
    for (const historyElement of history) {
        if (historyElement.event_type === 'transfer' && historyElement.event_type_deprecated === 'transfer') {
            iterator++;
        }
    }
    return iterator;
}

function findArtist(history) {
    let artist = '';
    for (const historyElement of history) {
        if (historyElement.event_type_deprecated === 'list') {
            artist = historyElement.creator_address;
            return artist;
        }
    }
}

function collectRate(history) {
    let purchaseTimestamps = getListOfPurchaseTimestamps(history);
    let iterator = 1;
    let sum = 0;
    for (const purchaseTimestamp of purchaseTimestamps) {
        if (purchaseTimestamps[iterator]) {
            sum += purchaseTimestamps[iterator] - purchaseTimestamp;
            iterator++;
        }
    }
    return Math.floor((sum / purchaseTimestamps.length) * 1000);
}

analyseObjkt()