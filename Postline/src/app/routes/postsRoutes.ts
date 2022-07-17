export const postsRoutes = {
  getAllPost: (pageNumber:number, pageSize:number)=>`post?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  getOnePost: (id: string) => `post/${id}`,
  getUserPosts:'post/user',
  createPost:"post",
  updatePost:  `post`,
  deletePost:(id: string) => `post/${id}`
};
