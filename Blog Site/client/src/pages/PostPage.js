import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { format } from "date-fns";
import { UserContext } from "../UserInfoProvider";
import { Link } from "react-router-dom";

const PostPage = () => {
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch(`http://localhost:3001/post/${id}`)
      .then((response) => response.json())
      .then((data) => setPostInfo(data));
  }, []);

  if (!postInfo) return "";

  return (
    <div className="post-page">
      <div className="image">
        <img src={`http://localhost:3001/${postInfo.cover}`} />
      </div>
      <h1>{postInfo.title}</h1>
      <time>{format(new Date(postInfo.createdAt), "MMM d, yyyy HH:mm")}</time>
      <div className="author">
        by @<i>{postInfo.author.username}</i>
      </div>
      {userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <Link to={`/edit/${postInfo._id}`} className="edit-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
            Edit this post
          </Link>
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: postInfo.content }} />
    </div>
  );
};

export default PostPage;
