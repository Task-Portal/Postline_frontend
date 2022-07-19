export const postsRoutes = {
  // getAllPost: (pageNumber: number, pageSize: number) => `post?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  getOnePost: (id: string) => `post/${id}`,
  getUserPosts: 'post/user',
  createPost: "post",
  updatePost: `post`,
  deletePost: (id: string) => `post/${id}`,

  generateRoute: (pageNumber: number, pageSize: number, postsFrom: string, postsTo: string, categoryName: string) => {

    let route = `post?pageNumber=${pageNumber}&pageSize=${pageSize}`

    if (postsFrom) route += `&postFrom=${postsFrom}&postTo=${postsTo}`

    if (categoryName) route += `&categoryName=${categoryName}`


    return route
  }
};
