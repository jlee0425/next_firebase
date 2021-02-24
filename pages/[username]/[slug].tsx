import React from 'react';
import {
	firestore,
	getUserWithUsername,
	postToJSON,
} from '../../utils/firebase';

interface Props {}

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

export const getStaticPath = async () => {
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
	return (
		<main>
			<h1>User Custom Page</h1>
		</main>
	);
};

export default UserPage;
