
import './App.css'
import { RelayEnvironmentProvider } from "react-relay";
import { RelayEnvironment } from "./relayEnvironment";
import SamData from "./Components/SamData"


const environment = RelayEnvironment;
function App() {

  
  return (
    <RelayEnvironmentProvider environment={environment}>
      <SamData/>
    </RelayEnvironmentProvider>
  )
}

export default App
