import React, { useState } from 'react'

const RegisterPage = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleRegister(event) {
    // console.log("the form has been submitted")
    event.preventDefault();
    const url = 'http://localhost:3001/register'
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, password})
    })
    .then(response => {
      console.log(response)
      if(response.status === 200) {
        alert("Registration Successful")
      } else{
        alert("Registration failed!!")
      }
    })
    .catch(err => {
      console.log(err);
      alert('Registration failed')
    })
  }

  return (
    <form className='register' onSubmit={handleRegister}>
        <h1>Register</h1>
        <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button >Register</button>
    </form>
  )
}

export default RegisterPage