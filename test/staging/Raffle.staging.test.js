const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Staging Tests", function () {
          let raffle, raffleEntranceFee, deployer

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          describe("fulfillRandomWords", function () {
              isCallTrace(
                  "Works with live Chailink Keepers and Chainlink VRF, we get a random winner",
                  async function () {
                      // enter the raffle
                      const startingTimeStamp = await raffle.getLatestTimeStamp()
                      const accounts = await ethers.getSigners()

                      await new Promise(async (resolve, reject) => {
                          raffle.once("WinnerPicked", async () => {
                              console.log("WinnerPicked event fired!")

                              try {
                                  // add our asserts here
                                  const recentWinner = await raffle.getRecentWinner()
                                  const raffleState = await raffle.getraffleState()
                                  const winnerEndingBalance = await accounts[0].getBalance()
                                  const endingTimeStamp = await raffle.getLatestTimeStamp()

                                  await expect(raffle.getPlayer(0)).to.be.reverted
                                  assert.equal(recentWinner.toString(), accounts[0].address)
                                  assert.equal(raffleState, 0)
                                  assert.equal(
                                      winnerEndingBalance.toString(),
                                      winnerStartingBalanceBalnce.add(raffleEntranceFee).toString()
                                  )
                                  assert(endingTimeStamp > startingTimeStamp)
                                  resolve()
                              } catch (error) {
                                  console.log(error)
                                  reject(e)
                              }
                          })
                          // Then entering the raffle
                          await raffle.enterRaffle({ value: raffleEntranceFee })
                          const winnerStartingBalance = await accounts[0].getBalance()

                          // amd this code WONT complete until our listener has finished listening
                      })

                      // setup listener before we enter the raffle
                      // Just in case the blockchain moves REALLY fast

                      // await raffle.enterRaffle({ value: raffleEntranceFee })
                  }
              )
          })
      })
