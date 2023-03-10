import axios from "axios";

const endpoint = 'https://data.objkt.com/v3/graphql';

const header = {
    "content-type": "application/json",
    "Accept-Encoding": '*'
}

export async function getLatestObjkt() {

    const getLatestObjktQuery = {
        "query": `query MyQuery {
          event(
            order_by: {id: desc, timestamp: desc}
            limit: 60
            where: {event_type_deprecated: {_eq: "ask_purchase"}}
          ) {
            creator_address
            fa_contract
            token {
              token_id
            }
          }
        }`
    }

    return axios({
        url: endpoint,
        method: 'post',
        headers: header,
        data: getLatestObjktQuery
    }).then(response => {
        return response.data.data.event
    })
}

export async function getObjktDetails(contract, tokenId) {
    const getEvents = {
        "query" : `query getEvent {
            event(
            where: {timestamp: {_is_null: false},
            reverted: {_neq: true},
            token: {token_id: {_eq: "${tokenId}"}, fa_contract: {_eq: "${contract}"}}}
            order_by: {timestamp: asc, id: asc}
          ) {
            event_type
            creator_address
            event_type_deprecated
            amount
            fa_contract
            id
            price
            recipient_address
            timestamp
            token {
              name
              token_id
              royalties {
                amount
                decimals
              }
            }
          }
        }`
    }

    return axios({
        url: endpoint,
        method: 'post',
        headers: header,
        data: getEvents
    }).then(response => {
        return response.data.data.event
    })
}