import React from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { Post } from '../../components/PostFeed';
import {
	firestore,
	getUserWithUsername,
	postToJSON,
} from '../../utils/firebase';
import styles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import AuthCheck from '../../components/AuthCheck';
import HeartButton from '../../components/HeartButton';
import Link from 'next/link';

interface Props {
	path: string;
	post: Post;
}

export const getStaticProps = async ({ params }) => {
	const { username, slug } = params;
	const userDoc = await getUserWithUsername(username);

	let post;
	let path;

	if (userDoc) {
		const postRef = userDoc.ref.collection('posts').doc(slug);
		post = postToJSON(await postRef.get());

		path = postRef.path;
	}

	return {
		props: { post, path },
		revalidate: 5000,
	};
};

export const getStaticPaths = async () => {
	const snapshot = await firestore.collectionGroup('posts').get();

	const paths = snapshot.docs.map((doc) => {
		const { slug, username } = doc.data();
		return {
			params: { username, slug },
		};
	});

	return {
		paths,
		fallback: 'blocking', // falls back to regular ssr if the page hasn't been rendered yet
		// once rendered, the page gets cached.
	};
};

const UserPage = (props: Props) => {
	const postRef = firestore.doc(props.path);
	const [realtimePost] = useDocumentData(postRef);
	const post = (realtimePost as Post) || props.post;

	return (
		<main className={styles.container}>
			<section>
				<PostContent post={post} />
			</section>
			<aside className='card'>
				<p>
					<strong>{post.heartCount || 0} 💓 </strong>
				</p>
				<AuthCheck
					fallback={
						<Link href='/enter'>
							<button>💖 Sign Up</button>
						</Link>
					}
				>
					<HeartButton postRef={postRef} />
				</AuthCheck>
			</aside>
		</main>
	);
};

export default UserPage;
