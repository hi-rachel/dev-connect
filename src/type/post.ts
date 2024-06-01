export interface IPost {
  postId: string;
  userName: string;
  userId: string;
  userImg: string;
  content: string;
  createdAt: string;
  postImg?: string;
  tags: [];
  bookmarkedBy: [];
  likedBy: [];
}
