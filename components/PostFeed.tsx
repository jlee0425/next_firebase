import Link from 'next/link';
import React from 'react';
import firebase from 'firebase';

export interface PostFeedProps {
	posts: Post[];
	admin: boolean;
}

export interface Post {
	title: string;
	slug: string;
	uid: string;
	username: string;
	published: boolean;
	content: string;
	createdAt: firebase.firestore.Timestamp;
	updatedAt: firebase.firestore.Timestamp;
	heartCount: number;
}

const PostFeed = ({ posts, admin }: PostFeedProps) => {
	return posts ? (
		<>
			{posts.map((post) => (
				<PostItem post={post} key={post.slug} admin={admin} />
			))}
		</>
	) : null;
};

const PostItem = ({ post, admin = false }: { post: Post; admin: boolean }) => {
	const wordCount = post?.content.trim().split(/\s+/g).length;
	const minutesToRead = (wordCount / 100 + 1).toFixed(0);

	return (
		<div className='card'>
			<Link href={`/${post.username}`}>
				<a>
					<strong>By @{post.username}</strong>
				</a>
			</Link>
			<Link href={`/${post.username}/${post.slug}`}>
				<h2>
					<a>{post.title}</a>
				</h2>
			</Link>
			<footer>
				<span>
					{wordCount} words. {minutesToRead} min read
				</span>
				<span>{post.heartCount} 💓 </span>
			</footer>
		</div>
	);
};
export default PostFeed;
