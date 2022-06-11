import type { GetStaticProps, NextPage } from 'next'

import { getOrders } from '../utils/upbit'

type Props = {
  ordersGroupByDate: any
}

const Home: NextPage<Props> = ({ ordersGroupByDate }) => {
  const statistics = []

  for (const date of Object.keys(ordersGroupByDate)) {
    let wonSummation = 0
    let satoshiSummation = 0
    let fee = 0
    for (const order of ordersGroupByDate[date]) {
      wonSummation += +order.won
      satoshiSummation += order.satoshi
      fee += +order.fee
    }
    statistics.push({
      date,
      wonSummation,
      satoshiSummation,
      fee,
    })
  }

  return (
    <div>
      <h6>손익(총) = 손익(원) + 손익(사토시) * 사토시시세 - 수수료</h6>

      <table>
        <thead>
          <tr>
            <th>일시</th>
            <th>손익(총)</th>
            <th>손익(원)</th>
            <th>손익(Satoshi)</th>
            <th>수수료</th>
          </tr>
        </thead>
        <tbody>
          {statistics.map(({ date, wonSummation, satoshiSummation, fee }, i) => (
            <tr key={i}>
              <td>{date}</td>
              <td>{(wonSummation - fee + satoshiSummation).toFixed(2)}</td>
              <td>{wonSummation.toFixed(2)}</td>
              <td>{satoshiSummation.toFixed(2)}</td>
              <td>{fee.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <pre>{JSON.stringify(ordersGroupByDate, null, 2)}</pre>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const orders1 = await getOrders({
    market: 'KRW-BTC',
    state: 'done',
  })
  const orders2 = await getOrders({
    market: 'KRW-BTC',
    state: 'done',
    page: 2,
  })
  const orders3 = await getOrders({
    market: 'KRW-BTC',
    state: 'done',
    page: 3,
  })
  const orders4 = await getOrders({
    market: 'KRW-BTC',
    state: 'done',
    page: 4,
  })
  const orders5 = await getOrders({
    market: 'KRW-BTC',
    state: 'done',
    page: 5,
  })

  const orders = [...orders1, ...orders2, ...orders3, ...orders4, ...orders5]

  const ordersGroupByDate: any = {}

  for (const order of orders) {
    const bitcoinVolume = order.executed_volume.split('.')
    const satoshi = +bitcoinVolume[0] * 100_000_000 + +bitcoinVolume[1].padEnd(8, '0')
    const _ = `${satoshi * +order.price.split('.')[0]}` // bitcoin 시세 100원 미만시 오류 발생
    const wonInt = _.slice(0, _.length - 8)
    const wonDecimal = _.slice(_.length - 8, _.length)
    const wonSign = order.side === 'ask' ? '' : '-'

    const key = new Date(order.created_at).toLocaleDateString()
    if (!ordersGroupByDate[key]) ordersGroupByDate[key] = []

    ordersGroupByDate[key].push({
      won: `${wonSign}${wonInt}.${wonDecimal}`,
      satoshi: order.side === 'ask' ? -satoshi : satoshi,
      fee: order.paid_fee,
    })
  }

  return {
    props: {
      ordersGroupByDate,
    },
    revalidate: 600,
  }
}

export default Home
