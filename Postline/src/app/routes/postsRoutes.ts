import {IPostParams} from "../interfaces/post/postParams";

export const postsRoutes = {
  getOnePost: (id: string) => `post/${id}`,
  getUserPosts: 'post/user',
  createPost: "post",
  updatePost: `post`,
  deletePost: (id: string) => `post/${id}`,

  generateRoute: (pageNumber: number, pageSize: number, params: IPostParams) => {

    let route = `post?pageNumber=${pageNumber}&pageSize=${pageSize}`

    Object.entries(params).map(p => {
      if (p[1]) {
        route+=`&${p[0]}=${p[1]}`
      }
    })


    return route
  }
};
