import {getLatestObjkt, getObjktDetails} from './repository.js'
import differenceBy from 'lodash/differenceBy.js'
import isEqual from 'lodash/isEqual.js'


let final = [];

async function analyseObjkt() {
    const latestObjktPurchases = await getLatestObjkt()
    const result = [];
    let resultObjkt;
    if (latestObjktPurchases.length > 0) {
        for (const objkt of latestObjktPurchases) {
            let objktHistory = await getObjktDetails(objkt.fa_contract, objkt.token.token_id)
            if (checkIfIBought(objktHistory)) {
                if (checkAvailability(objktHistory)) {
                    // if (soldRate(objktHistory) > 0.5) {
                        // if (collectRate(objktHistory) < 100) {
                            resultObjkt = {
                                "name": objktHistory[0].token.name,
                                "royalty": getRoyalty(objktHistory[0].token.royalties),
                                "price": objktHistory[0].price,
                                "address": "https://objkt.com/asset/" + objktHistory[0].fa_contract + "/" + objktHistory[0].token.token_id,
                                "collectRate": collectRate(objktHistory)
                            }
                            if (checkObjkts(result, resultObjkt)) {
                                result.push(resultObjkt);
                            }
                        // }
                    // }
                }
            }
        }
    }
    console.log(final)
    console.log(result)
    let tempArr = differenceBy(result, final, 'address' || 'collectRate');
    console.log(tempArr)
    if (tempArr.length > 0) {
        for (const tempArrElement of tempArr) {
            final.push(tempArrElement)
            console.log(tempArrElement)
        }
    }
}

// const mockData = await getObjktDetails('KT1BMYT898FdtVPABmpjeW5ZTUWh8cZs8AXv', 0);

function checkIfIBought(list) {
    for (const listElement of list) {
        if (listElement.recipient_address === 'tz1ibW4sjBmVJEuCnaBzqRcvrU5mzNJfd9Ni' && listElement.event_type === 'transfer') {
            return false
        }
    }
    return true
}

function getRoyalty(royalties) {
    let amount = 0;
    let decimal = 0;
    for (const royalty of royalties) {
        amount += royalty.amount
        decimal = royalty.decimals
    }
    amount = (amount / Math.pow(10, decimal)) * 100;
    return amount + '%'
}

function getListOfPurchaseTimestamps(history) {
    let purchaseTimestamps = [];
    for (const historyElement of history) {
        if (historyElement.event_type_deprecated === 'ask_purchase') {
            let date = Math.round((new Date(historyElement.timestamp).getTime()) / 1000 / 60);
            purchaseTimestamps.push(date);
        }
    }
    return purchaseTimestamps;
}

function checkAvailability(history) {
    let listEdition = amountOfListEdition(history)
    let soldEdition = amountOfSoldEdition(history)
    if (listEdition > 1) {
        if (listEdition < 100) {
            if (soldEdition > 2) {
                if (listEdition > soldEdition) {
                    return true;
                }
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

function purchases(history) {
    let amount = 0;
    for (const historyElement of history) {
        if (historyElement.event_type_deprecated === 'ask_purchase') {
            amount++;
        }
    }
    return amount;
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

function checkObjkts(arr, obj) {
    for (const arrElement of arr) {
        if (isEqual(arrElement, obj)) {
            return false;
        }
    }
    return true;
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
    return Math.floor(sum / (purchaseTimestamps.length - 1));
}

function soldRate(history) {
    let listEdition = amountOfListEdition(history);
    let purchase = purchases(history);
    return purchase / listEdition;
}

// console.log(collectRate(mockData))
setInterval(() => analyseObjkt(), 60000)

// analyseObjkt()

let arr1 = [{"id": 23, "name": "a"},{"id": 23, "name": "b"}]
let arr2 = [{"id": 23, "name": "a"}, {"id": 43, "name": "b"}, {"id": 24, "name": "e"}]

let arr3 = differenceBy(arr1, arr2, 'id' || 'name')

// console.log(arr3)