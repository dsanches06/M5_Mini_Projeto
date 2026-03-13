let comments = [];
let id = 0;

export const getAllComments = () => {
  return comments;
};

export const createComment = (data) => {
  const comment = {
    id: id++,
    message: data.message,
    date: data.date,

  };
  comments.push(comment);
  return comment;
};

export const updateComment = (commentId, data) => {
  const comment = comments.find((c) => c.id === commentId);
  if (!comment) {
    throw new Error("Comment not found");
  }

  comment.message = data.message ?? comment.message;
  comment.date = data.date ?? comment.date;

  return comment;
};

export const deleteComment = (commentId) => {
  comments = comments.filter((c) => c.id !== commentId);
};



