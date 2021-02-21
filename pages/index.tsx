import Link from 'next/link';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import PostFeed from '../components/PostFeed';
import styles from '../styles/Home.module.css';
import { firestore, fromMillis, postToJSON } from '../utils/firebase';

const LIMIT = 1;

export const getServerSideProps = async () => {
	const postsQuery = firestore
		.collectionGroup('posts')
		.where('published', '==', true)
		.orderBy('createdAt', 'desc')
		.limit(LIMIT);

	const posts = (await postsQuery.get()).docs.map(postToJSON);

	return {
		props: { posts },
	};
};

const Home = (props) => {
	const [posts, setPosts] = useState(props.posts);
	const [loading, setLoading] = useState(false);
	const [postsEnd, setPostsEnd] = useState(false);

	const getMorePosts = async () => {
		setLoading(true);
		const last = posts[posts.length - 1];
		const cursor =
			typeof last.createdAt === 'number'
				? fromMillis(last.createdAt)
				: last.createdAt;

		const query = firestore
			.collectionGroup('posts')
			.where('published', '==', true)
			.orderBy('createdAt', 'desc')
			.startAfter(cursor)
			.limit(LIMIT);

		const newPosts = (await query.get()).docs.map((doc) => doc.data());

		setPosts(posts.concat(newPosts));
		setLoading(false);

		if (newPosts.length < LIMIT) {
			setPostsEnd(true);
		}
	};

	return (
		<div className={styles.container}>
			<PostFeed posts={posts} admin={true} />
			{!loading && !postsEnd && (
				<button onClick={getMorePosts}>Load More</button>
			)}
			<Loader show={loading} />
			{postsEnd && 'You have reached the end!'}
		</div>
	);
};

export default Home;
