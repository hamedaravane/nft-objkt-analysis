import {getLatestObjkt, getObjktDetails} from './repository.js'

async function analyseObjkt() {
    const latestObjktPurchases = await getLatestObjkt()
    for (const objkt of latestObjktPurchases) {
        let tempArray = await getObjktDetails(objkt.fa_contract, objkt.token.token_id)
        checkAvailability(tempArray)
    }
}

const mockData = [
    {
        event_type: 'mint',
        event_type_deprecated: 'mint',
        amount: 10,
        fa_contract: 'KT1HuJEjq69q2Yo6UR1onS1mpEGefw1V4V9b',
        price: null,
        recipient_address: null,
        timestamp: '2022-11-07T15:32:44+00:00'
    },
    {
        event_type: null,
        event_type_deprecated: 'list',
        amount: 10,
        fa_contract: 'KT1HuJEjq69q2Yo6UR1onS1mpEGefw1V4V9b',
        price: 4000000,
        recipient_address: null,
        timestamp: '2022-11-07T16:04:44+00:00'
    },
    {
        event_type: null,
        event_type_deprecated: 'ask_purchase',
        amount: 1,
        fa_contract: 'KT1HuJEjq69q2Yo6UR1onS1mpEGefw1V4V9b',
        price: 4000000,
        recipient_address: 'tz1avi1ePHTJCzpbk15pAD2cQgj943fDP7r9',
        timestamp: '2022-11-30T15:45:44+00:00'
    },
    {
        event_type: 'transfer',
        event_type_deprecated: 'transfer',
        amount: 1,
        fa_contract: 'KT1HuJEjq69q2Yo6UR1onS1mpEGefw1V4V9b',
        price: null,
        recipient_address: 'tz1ibW4sjBmVJEuCnaBzqRcvrU5mzNJfd9Ni',
        timestamp: '2022-11-30T15:45:44+00:00'
    },
    {
        event_type: null,
        event_type_deprecated: 'ask_purchase',
        amount: 1,
        fa_contract: 'KT1HuJEjq69q2Yo6UR1onS1mpEGefw1V4V9b',
        price: 4000000,
        recipient_address: 'tz1dGN7sBvQMSPACh28ZwVWQAi5K5KZkdtNb',
        timestamp: '2022-12-28T18:07:59+00:00'
    },
    {
        event_type: 'transfer',
        event_type_deprecated: 'transfer',
        amount: 1,
        fa_contract: 'KT1HuJEjq69q2Yo6UR1onS1mpEGefw1V4V9b',
        price: null,
        recipient_address: 'tz1dGN7sBvQMSPACh28ZwVWQAi5K5KZkdtNb',
        timestamp: '2022-12-28T18:07:59+00:00'
    },
    {
        event_type: null,
        event_type_deprecated: 'ask_purchase',
        amount: 1,
        fa_contract: 'KT1HuJEjq69q2Yo6UR1onS1mpEGefw1V4V9b',
        price: 4000000,
        recipient_address: 'tz1LVAmuXtZauarKZ11ZmZSQXmHKzLGpdifV',
        timestamp: '2022-12-28T20:35:14+00:00'
    },
    {
        event_type: 'transfer',
        event_type_deprecated: 'transfer',
        amount: 1,
        fa_contract: 'KT1HuJEjq69q2Yo6UR1onS1mpEGefw1V4V9b',
        price: null,
        recipient_address: 'tz1dGN7sBvQMSPACh28ZwVWQAi5K5KZkdtNb',
        timestamp: '2022-12-28T20:35:14+00:00'
    }
];

function checkIfIBought(list) {
    for (const listElement of list) {
        if (listElement.recipient_address === 'tz1ibW4sjBmVJEuCnaBzqRcvrU5mzNJfd9Ni' && listElement.event_type === 'transfer') {
            return true
        }
    }
    return false
}

function checkAvailability(list) {
    let iterator = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i].event_type_deprecated === 'list') {
            console.log(list[i].amount)
            if (list[i].amount > 1) {
                for (let j = 0; j < list.length; j++) {
                    if (list[j].event_type === 'transfer') {
                        iterator++;
                    }
                }
                if (list[i].amount > iterator){
                    console.log('available for buying')
                } else {
                    console.log('not available')
                }
            }
        }
    }
}

// checkAvailability(mockData)
analyseObjkt()