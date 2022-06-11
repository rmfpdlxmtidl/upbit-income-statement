import { createHash } from 'crypto'
import { encode } from 'querystring'

import { sign } from 'jsonwebtoken'
import fetch from 'node-fetch'
import { v4 as uuidv4 } from 'uuid'

import { UpbitError, UpbitOrderDetail } from '../types/upbit'
import { UPBIT_ACCESS_KEY, UPBIT_API_URL, UPBIT_SECRET_KEY } from './config'

function createToken(query?: string) {
  return query
    ? sign(
        {
          access_key: UPBIT_ACCESS_KEY,
          nonce: uuidv4(),
          query_hash: createHash('sha512').update(query, 'utf-8').digest('hex'),
          query_hash_alg: 'SHA512',
        },
        UPBIT_SECRET_KEY
      )
    : sign(
        {
          access_key: UPBIT_ACCESS_KEY,
          nonce: uuidv4(),
        },
        UPBIT_SECRET_KEY
      )
}

export async function getOrder(uuid: string) {
  const query = encode({ uuid })
  const response = await fetch(UPBIT_API_URL + '/v1/order?' + query, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${createToken(query)}`,
    },
  })
  return response.json() as Promise<UpbitOrderDetail>
}

type GetOrdersBody = {
  market: string
  state?: string
  states?: string[]
  limit?: number
  page?: number
}

export async function getOrders(body: GetOrdersBody) {
  const query = encode(body)
  const response = await fetch(UPBIT_API_URL + '/v1/orders?' + query, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${createToken(query)}`,
    },
  })
  return response.json() as Promise<UpbitOrderDetail[] & UpbitError>
}
