import React, { ReactElement } from 'react';
import PostFeed, { Post } from '../../components/PostFeed';
import UserProfile, { UserProps } from '../../components/UserProfile';
import { getUserWithUsername, postToJSON } from '../../utils/firebase';

interface Props {}

export const getServerSideProps = async ({ query }) => {
	const { username } = query;
	const userDoc = await getUserWithUsername(username);

	let user = null;
	let posts = null;

	if (userDoc) {
		user = userDoc.data();
		const postsQuery = userDoc.ref
			.collection('posts')
			.where('published', '==', true)
			.orderBy('createdAt', 'desc')
			.limit(5);

		posts = (await postsQuery.get()).docs.map(postToJSON);
	}

	return {
		props: { user, posts },
	};
};

const UserPage = ({ user, posts }: { user: UserProps; posts: Post[] }) => {
	return (
		<main>
			<UserProfile {...user} />
			<PostFeed posts={posts} admin={true} />
		</main>
	);
};

export default UserPage;
