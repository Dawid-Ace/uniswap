import axios from 'axios'
import { BigNumber } from 'ethers'
import { useState } from 'react'

const Fixture = () => {
  const [transactions, setTransactions] = useState([])

  return (
    <>
      <button
        onClick={() => {
          const transactions = []

          axios
            .get(
              'https://api-goerli.etherscan.io/api?module=account&action=tokentx&address=0xf37db69c87a9321a663e95ba3a4cacede23ede7e&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=QA63741U67QQ1H3P4IV3K1TKC38XBIEH1D'
            )
            .then(async (res) => {
              console.log(res.data.result)
              await res.data.result.map(async (transaction) => {
                if (transaction.from !== '0xf37db69c87a9321a663e95ba3a4cacede23ede7e') return

                const res = await axios.get(
                  `https://api-goerli.etherscan.io/api?module=account&action=tokentx&address=${transaction.to}&page=1&offset=100&startblock=${transaction.blockNumber}&endblock=${transaction.blockNumber}&sort=asc&apikey=QA63741U67QQ1H3P4IV3K1TKC38XBIEH1D`
                )

                await res.data.result.forEach((item) => {
                  if (item.tokenSymbol !== transaction.tokenSymbol) {
                    transactions.push({
                      from: transaction.from,
                      to: transaction.to,
                      entry: BigNumber.from(transaction.value)
                        .div(BigNumber.from(10).pow(transaction.tokenDecimal))
                        .toString(),
                      symbol: transaction.tokenSymbol,

                      anotherEntry: BigNumber.from(item.value)
                        .div(BigNumber.from(10).pow(item.tokenDecimal))
                        .toString(),
                      anotherSymbol: item.tokenSymbol,
                    })
                    setTransactions(transactions)
                  }
                })
              })
            })
            .catch((err) => console.log(err))
        }}
      >
        get
      </button>

      {transactions.map((transaction, index) => (
        <div key={index} style={{ display: 'flex', gap: '10px' }}>
          <div> {transaction.from}</div>
          <div> {transaction.to}</div>
          <div> {transaction.entry}</div>
          <div> {transaction.symbol}</div>
          <div> {transaction.anotherEntry}</div>
          <div> {transaction.anotherSymbol}</div>
        </div>
      ))}
    </>
  )
}

export default Fixture
