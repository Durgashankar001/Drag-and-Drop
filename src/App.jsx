import { useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Drop from './Components/Drop'

//Starting Data
const intialData = [
  {
    title: "RED",
    color: "red",
    items: [
      {
        content: "Hey I am Red",
        color: "red"
      }
    ]
  },
  {
    title: "BLUE",
    color: "blue",
    items: [
      {
        content: "Hey I am Blue",
        color: "blue"
      }
    ]
  },
  {
    title: "GREEN",
    color: "green",
    items: [
      {
        content: "Hey I am Green",
        color: "green"
      }
    ]
  },
  {
    title: "BLACK",
    color: "black",
    items: [
      {
        content: "Hey I am Black",
        color: "black"
      }
    ]
  }
]
function App() {
  const toast = useToast()
  const [data, setData] = useState(JSON.parse(localStorage.getItem("zino_tech_list_darg_drop_dp")) || intialData)
  useEffect(() => {
    let res = JSON.parse(localStorage.getItem("zino_tech_list_darg_drop_dp"))
    if (!res) {
      localStorage.setItem("zino_tech_list_darg_drop_dp", JSON.stringify(intialData))
      setData(intialData)
    }
  }, [])
  return (
    <div className="App">
      <div className='heading'>DRAG & DROP</div>
      <header className='header'>
        {
          data && <Drop data={data} />
        }
      </header>
    </div>
  )
}

export default App
