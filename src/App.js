import './App.css'
import { useEffect, useState } from 'react'
import { Contract, BrowserProvider } from 'ethers'
import NFT from './abi/horoscopeNFT.json'

const NFT_CONTRACT_ADDRESS = '0x8870bcB2ED0902CDda22B6687D8fF21cbf9fb9dF'

const zodiacImages = {
  Aquarius: '/images/aquarius.jpeg',
  Pisces: '/images/pisces.jpeg',
  Aries: '/images/aries.jpeg',
  Taurus: '/images/taurus.jpeg',
  Gemini: '/images/gemini.jpeg',
  Cancer: '/images/cancer.jpeg',
  Leo: '/images/leo.jpeg',
  Virgo: '/images/virgo.jpeg',
  Libra: '/images/libra.jpeg',
  Scorpio: '/images/scorpio.jpeg',
  Sagittarius: '/images/sagittarius.jpeg',
  Capricorn: '/images/capricorn.jpeg',
}

function App() {
  const [isWalletInstalled, setIsWalletInstalled] = useState(false)
  const [date, setDate] = useState('1992-08-31')
  const [zodiacSign, setZodiacSign] = useState(null)
  const [isMinting, setIsMinting] = useState(false)
  const [NFTContract, setNFTContract] = useState(null)
  const [account, setAccount] = useState(null)

  // State to store the generated tint color
  const [randomColor, setRandomColor] = useState(null)

  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true)
    }
  }, [])

  function handleDateInput({ target }) {
    setDate(target.value)
  }

  async function connectWallet() {
    window.ethereum
      .request({
        method: 'eth_requestAccounts',
      })
      .then((accounts) => {
        setAccount(accounts[0])
      })
      .catch((error) => {
        alert('Something went wrong')
      })
  }

  useEffect(() => {
    calculateZodiacSign(date)
  }, [date])

  function calculateZodiacSign(date) {
    let dateObject = new Date(date)
    let day = dateObject.getDate()
    let month = dateObject.getMonth()
    if (month === 0) {
      if (day >= 20) setZodiacSign('Aquarius')
      else setZodiacSign('Capricorn')
    } else if (month === 1) {
      if (day >= 19) setZodiacSign('Pisces')
      else setZodiacSign('Aquarius')
    } else if (month === 2) {
      if (day >= 21) setZodiacSign('Aries')
      else setZodiacSign('Pisces')
    } else if (month === 3) {
      if (day >= 20) setZodiacSign('Taurus')
      else setZodiacSign('Aries')
    } else if (month === 4) {
      if (day >= 21) setZodiacSign('Gemini')
      else setZodiacSign('Taurus')
    } else if (month === 5) {
      if (day >= 21) setZodiacSign('Cancer')
      else setZodiacSign('Gemini')
    } else if (month === 6) {
      if (day >= 23) setZodiacSign('Leo')
      else setZodiacSign('Cancer')
    } else if (month === 7) {
      if (day >= 23) setZodiacSign('Virgo')
      else setZodiacSign('Leo')
    } else if (month === 8) {
      if (day >= 23) setZodiacSign('Libra')
      else setZodiacSign('Virgo')
    } else if (month === 9) {
      if (day >= 23) setZodiacSign('Scorpio')
      else setZodiacSign('Libra')
    } else if (month === 10) {
      if (day >= 22) setZodiacSign('Sagittarius')
      else setZodiacSign('Scorpio')
    } else if (month === 11) {
      if (day >= 22) setZodiacSign('Capricorn')
      else setZodiacSign('Sagittarius')
    }
  }

  useEffect(() => {
    function initNFTContract() {
      const provider = new BrowserProvider(window.ethereum)
      provider
        .getSigner()
        .then((signer) => {
          setNFTContract(new Contract(NFT_CONTRACT_ADDRESS, NFT.abi, signer))
        })
        .catch((error) => {
          console.error('Error initializing contract:', error)
        })
    }
    initNFTContract()
  }, [account])

  async function mintNFT() {
    setIsMinting(true)

    // Generate random HSL color for tinting the image
    const h = Math.floor(Math.random() * 360) // Random hue
    const s = Math.floor(Math.random() * 100) // Random saturation
    const l = Math.floor(Math.random() * 100) // Random lightness
    const color = `hsl(${h}, ${s}%, ${l}%)`

    setRandomColor(color) // Set the tint color

    try {
      const transaction = await NFTContract.mintNFT(account, zodiacSign)
      await transaction.wait()
    } catch (e) {
      console.error(e)
    } finally {
      alert('Minting Successful')
      setIsMinting(false)
    }
  }

  if (account === null) {
    return (
      <div className="App">
        <br />
        {isWalletInstalled ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <p>Install Metamask wallet</p>
        )}
      </div>
    )
  }

  return (
    <div className="App">
      <h1>Horoscope NFT Minting Dapp</h1>
      <p>Connected as: {account}</p>
      <input onChange={handleDateInput} value={date} type="date" id="dob" />
      <br />
      <br />
      {zodiacSign && (
        <img
          src={zodiacImages[zodiacSign]} // Dynamically load zodiac image
          alt={zodiacSign}
          width="400px"
          height="400px"
          style={{
            filter: `hue-rotate(${Math.random() * 360}deg)`, // Apply a random color hue rotation
            WebkitFilter: `hue-rotate(${Math.random() * 360}deg)`, // Ensure cross-browser compatibility
          }}
        />
      )}
      <br />
      <br />
      <button disabled={isMinting} onClick={mintNFT}>
        {isMinting ? 'Minting...' : 'Mint'}
      </button>
    </div>
  )
}

export default App
