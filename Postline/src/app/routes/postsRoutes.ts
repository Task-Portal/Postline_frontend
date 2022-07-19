export const postsRoutes = {
  getAllPost: (pageNumber:number, pageSize:number)=>`post?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  getOnePost: (id: string) => `post/${id}`,
  getUserPosts:'post/user',
  createPost:"post",
  updatePost:  `post`,
  deletePost:(id: string) => `post/${id}`,
  getPostsByCategory:(pageNumber:number, pageSize:number,categoryName:string)=>
    `post?pageNumber=${pageNumber}&pageSize=${pageSize}&categoryName=${categoryName}`,

  getPostsByDate:(pageNumber:number, pageSize:number,postsFrom:string, postsTo:string)=>
    `post?pageNumber=${pageNumber}&pageSize=${pageSize}&postFrom=${postsFrom}&postTo=${postsTo}`,

  getPostsByDateAndCategory:(pageNumber:number, pageSize:number,postsFrom:string, postsTo:string,categoryName:string)=>
    `post?pageNumber=${pageNumber}&pageSize=${pageSize}&postFrom=${postsFrom}&postTo=${postsTo}&categoryName=${categoryName}`
};
