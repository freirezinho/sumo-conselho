import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'
import { IdProvider } from './hooks/use_user_id';
import { PrivateRoute } from './infra/navigation/PrivateRoute';
import { AuthForm } from './pages/auth/auth_form';
import { ThankYou } from './pages/thanks/thank_you';
import { SustainingForm } from './pages/sustaining/sustaining_form';

function App() {
  return (
    <>
        <IdProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<PrivateRoute />}>
                <Route path='/' element={<SustainingForm />} />
                <Route path='/apoios' element={<SustainingForm />} />
                <Route path='/obrigado' element={<ThankYou />} />
              </Route>
              <Route path='/auth' element={<AuthForm />} />
            </Routes>
          </BrowserRouter>
        </IdProvider>
    </>
  )
}

export default App
