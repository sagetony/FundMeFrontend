import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
withdrawButton.onclick = withdraw
balanceButton.onclick = balance

async function connect() {
    if (typeof window.ethereum != "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            connectButton.innerHTML = "Connected"
        } catch (error) {
            console.log(error)
        }
    } else {
        connectButton.innerHTML = "Please Install Metamask"
    }
}

// fund
async function fund() {
    let ethAmount = document.getElementById("amount").value
    if (typeof window.ethereum != "undefined") {
        console.log("funding..")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenTransaction(transactionResponse, provider)
            console.log("Done!!")
        } catch (error) {
            console.log(error)
        }
    } else {
        connectButton.innerHTML = "Please Install Metamask"
    }
}
// balance
async function balance() {
    if (typeof window.ethereum != "undefined") {
        console.log("balance..")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}
// withdraw
async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("withdraw..")

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const Contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await Contract.withdraw()
            await listenTransaction(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}
function listenTransaction(transactionResponse, provider) {
    console.log("Getting Transaction Receipt")
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionResponse) => {
            console.log(
                `Completed with ${transactionResponse.confirmations} confirmations`
            )
            resolve()
        })
    })
}
