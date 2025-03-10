import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import SendScreens from './pages/SendScreens.tsx'


function App() {
  const [count, setCount] = useState(0)
  const [test, setTest] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = document.location.origin + '/';
        const response = await fetch(url)
        console.log(response)
        const data = await response.json()
        const  message = data.message
        console.log(message)
        setTest(message) // Assuming the response data is a string you want to display
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>{test} hey?</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Count is: {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
