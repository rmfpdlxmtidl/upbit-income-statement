import type { GetStaticProps, NextPage } from 'next'

import { getOrders } from '../utils/upbit'

type Props = {
  statistics: any[]
}

const Home: NextPage<Props> = ({ statistics }) => {
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
              <td>{(wonSummation - fee + satoshiSummation * 0.38).toFixed(2)}</td>
              <td>{wonSummation.toFixed(2)}</td>
              <td>{satoshiSummation}</td>
              <td>{fee.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const orders = await getOrders({
    market: 'KRW-BTC',
    state: 'done',
  })

  const ordersGroupByDate: any = {}

  for (const order of orders) {
    const wonSign = order.side === 'ask' ? '' : '-'
    const volume = order.executed_volume.split('.')
    const satoshi = +volume[0] * 100_000_000 + +volume[1].padEnd(8, '0')
    const rawWon = `${satoshi * +order.price.split('.')[0]}`
    const wonInt = rawWon.slice(0, rawWon.length - 8)
    const wonDecimal = rawWon.slice(rawWon.length - 8, rawWon.length)
    const stringWon = `${wonSign}${wonInt}.${wonDecimal}`

    const key = new Date(order.created_at).toLocaleDateString()
    if (!ordersGroupByDate[key]) ordersGroupByDate[key] = []
    ordersGroupByDate[key].push({
      won: +stringWon,
      satoshi: order.side === 'ask' ? -satoshi : satoshi,
      fee: order.paid_fee,
    })
  }

  const statistics = []

  for (const date of Object.keys(ordersGroupByDate)) {
    let wonSummation = 0
    let satoshiSummation = 0
    let fee = 0
    for (const order of ordersGroupByDate[date]) {
      wonSummation += order.won
      satoshiSummation += +order.satoshi
      fee += +order.fee
    }
    statistics.push({
      date,
      wonSummation,
      satoshiSummation,
      fee,
    })
  }

  return {
    props: {
      statistics,
    },
    revalidate: 600,
  }
}

export default Home
