import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserInfoProvider'

const Header = () => {

  const {userInfo, setUserInfo} = useContext(UserContext)
  

  useEffect(() =>{
    fetch("http://localhost:3001/profile", {
      credentials: 'include',
    })
    .then(response => response.json())
    .then(userInfo => {
      setUserInfo(userInfo)
    })

  }, [])

  function logout() {
    fetch('http://localhost:3001/logout', {
      credentials: 'include'
    }).then(() => setUserInfo(null))
  }

  const username = userInfo?.username;

  console.log("usernam is: ", username)

  return (
    <header>
        <Link to='/' className="logo">MyBlog</Link>
        <nav>
          { username && (
            <>
            {/* <span>Hello, {username}</span> */}
            <Link to='/create'>create new post</Link>
            <a onClick={logout}>LogOut</a>
            </>
          )}
          { !username && (
            <>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
            </>
          )}
        </nav>
      </header>
  )
}

export default Header