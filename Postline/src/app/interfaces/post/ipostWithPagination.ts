import {IPost} from "./ipost";

export interface IPostWithPagination {
  posts: IPost[],
  data: {
    currentPage: number,
    totalPages: number,
    pageSize: number,
    totalCount: number,
    hasPrevious: boolean,
    hasNext: boolean
  }
}
