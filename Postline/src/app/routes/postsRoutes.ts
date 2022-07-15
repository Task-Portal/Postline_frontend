export const postsRoutes = {
  getAllPost: 'post',
  getOnePost: (id: string) => `post/${id}`,
  getUserPosts:'post/user',
  createPost:"post",
  updatePost:  `post`,
  deletePost:(id: string) => `post/${id}`
};
