import { IUser } from '../interfaces/user';
import { Role } from '../enums/auth.enum';
import { IPost } from '../interfaces/ipost';

export class Post implements IPost {
  constructor(
    public id = '',
    public body = '',
    public categoryName = '',
    public userName = '',
    public postDate = new Date(),
    public rating = 0,
    public title = ''
  ) {}

  static Build(post: IPost) {
    if (!post) {
      return new Post();
    }

    return new Post(
      post.id,
      post.body,
      post.categoryName,
      post.userName,
      post.postDate,
      post.rating,
      post.title
    );
  }
}
