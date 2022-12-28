import axios from "axios";

export async function getLatestObjkt() {
    const endpoint = 'https://data.objkt.com/v3/graphql';

    const header = {
        "content-type": "application/json",
        "Accept-Encoding": '*'
    }

    const getLatestObjktQuery = {
        "query": `query MyQuery {
  event(
    order_by: {id: desc, timestamp: desc}
    limit: 10
    where: {event_type_deprecated: {_eq: "ask_purchase"}}
  ) {
    creator_address
    fa_contract
    token {
      token_id
    }
  }
}
`
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
        "query" : ``
    }
}