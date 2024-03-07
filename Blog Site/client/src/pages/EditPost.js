import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import Editor from "../Editor";

const EditPost = () => {
    const{id} = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(()=>{
    fetch(`http://localhost:3001/post/${id}`).then(response => response.json())
                                             .then(data => {
                                                setTitle(data.title)
                                                setContent(data.content)
                                                setSummary(data.summary)
                                             })
  },[])



  function updatePost(e){
    e.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    if(files?.[0]) {data.set('file', files?.[0]);}

    fetch(`http://localhost:3001/post/${id}`, {
        method: 'PUT',
        body: data,
        credentials: 'include'
    }).then(response => {
        if(response.ok){
            setRedirect(true)
        }
    })
  }

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }


  return (
    <form onSubmit={updatePost}>
      <input
        type="title"
        placeholder={"Title"}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="summary"
        placeholder={"Summary"}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: "5px" }}>Update post</button>
    </form>
  );
};

export default EditPost;
