import { IUser } from '../interfaces/user/user';
import { Role } from '../enums/auth.enum';
import { IPost } from '../interfaces/post/ipost';

export class Post implements IPost {
  constructor(
    public id = '',
    public body = '',
    public categoryName = '',
    public firstName = '',
    public lastName = '',
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
      post.firstName,
      post.lastName,
      post.postDate,
      post.rating,
      post.title
    );
  }
}
