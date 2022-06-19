import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
connectButton.onclick = connect
fundButton.onclick = fund

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
    let ethAmount = "77"
    if (typeof window.ethereum != "undefined") {
        console.log("funding..")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            console.log(ethAmount)
        } catch (error) {
            console.log(error)
        }
    } else {
        connectButton.innerHTML = "Please Install Metamask"
    }
}
