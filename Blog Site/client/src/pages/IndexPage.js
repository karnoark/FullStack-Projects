import React, { useEffect, useState } from 'react'
import Post from '../components/Post'

const IndexPage = () => {
  const [data, setData] = useState([]);

  useEffect(() =>{
    fetch('http://localhost:3001/post').then(response => response.json())
                                       .then(data => setData(data))
  }, [])

  console.log("this is useState data, ", data)


  return (
    <>
    {data.length >0 && data.map((obj) => <Post {...obj} /> )}
    </>
  )
}

export default IndexPage