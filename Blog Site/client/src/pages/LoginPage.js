import React, { useContext, useState } from 'react'
import {Navigate} from 'react-router-dom'
import { UserContext } from '../UserInfoProvider'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState(false)
  const {setUserInfo} = useContext(UserContext)

  async function handleLogin(event) {
    // console.log("the form has been submitted")
    event.preventDefault();
    const url = 'http://localhost:3001/login'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, password}),
      credentials: 'include',
    })

    if(response.ok) {
      response.json().then(data => {
        setUserInfo(data)
      })
      setRedirect(true)
    } else{
      alert("credentials didn't match")
    }
  }

  if(redirect){
    return <Navigate to={'/'} />
  }

  return (
    <form className='login' onSubmit={handleLogin}>
        <h1>Login</h1>
        <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button >Login</button>
    </form>
  )
}

export default LoginPage