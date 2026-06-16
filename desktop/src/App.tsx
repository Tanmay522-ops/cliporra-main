import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { Toaster } from 'sonner'
import ControlLayout from './layouts/ControlLayout'
import AuthButton from './components/Global/AuthButton'
import Widget from './components/Global/widget'

const client = new QueryClient()

function App() {
  return (
  <QueryClientProvider client={client}>
    <ControlLayout>
      <AuthButton/>
      <Widget/>
    </ControlLayout>
    <Toaster/>
  </QueryClientProvider>
  )
}

export default App
