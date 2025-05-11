import React, { useEffect, useState } from "react";
import { Container, Image, Alert } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import CommentList from "../../components/comments/CommentList";
import CommentForm from "../../components/comments/CommentForm";
import "./styles.css";

const Blog = props => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(!!location.state?.success);
  const [refreshComments, setRefreshComments] = useState(false);

  useEffect(() => {
    const { id } = params;
    fetch(`http://localhost:3001/posts/${id}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setBlog(data);
        setLoading(false);
      })
      .catch(() => {
        navigate("/404");
      });
  }, [params, navigate]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  if (loading) {
    return <div>loading</div>;
  } else {
    return (
      <div className="blog-details-root">
        <Container>
          {showSuccess && (
            <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
              {location.state.success}
            </Alert>
          )}
          <Image className="blog-details-cover" src={blog.cover} fluid />
          <h1 className="blog-details-title">{blog.title}</h1>

          <div className="blog-details-container">
            <div className="blog-details-author">
              <BlogAuthor {...blog.author} />
            </div>
            <div className="blog-details-info">
              <div>{blog.createdAt}</div>
              <div>{`lettura da ${blog.readTime.value} ${blog.readTime.unit}`}</div>
              <div style={{ marginTop: 20 }}>
                <BlogLike defaultLikes={["123"]} onChange={console.log} />
              </div>
            </div>
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: blog.content,
            }}
          ></div>

          {/* Commenti */}
          <hr />
          <h4 className="mt-5">Commenti</h4>
          <CommentForm
            postId={blog._id}
            onCommentAdded={() => setRefreshComments(r => !r)}
          />
          <CommentList postId={blog._id} key={refreshComments} />
        </Container>
      </div>
    );
  }
};

export default Blog;
