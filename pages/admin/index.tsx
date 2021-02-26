import { useRouter } from 'next/router';
import React, { FormEvent, useContext, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import AuthCheck from '../../components/AuthCheck';
import Metatags from '../../components/Metatags';
import PostFeed from '../../components/PostFeed';
import { UserContext } from '../../utils/context';
import { auth, firestore, serverTimestamp } from '../../utils/firebase';
import styles from '../../styles/Admin.module.css';
import toast from 'react-hot-toast';

interface Props {}

const AdminPage = (props: Props) => {
	return (
		<main>
			<AuthCheck>
				<Metatags title='admin page' />
				<PostList />
				<CreateNewPost />
			</AuthCheck>
		</main>
	);
};

const PostList = () => {
	const ref = firestore
		.collection('users')
		.doc(auth.currentUser.uid)
		.collection('posts');
	const query = ref.orderBy('createdAt');
	const [querySnapshot] = useCollection(query);
	const posts = querySnapshot?.docs.map((doc) => doc.data());

	return (
		<>
			<h1>Manage Your Posts</h1>
			<PostFeed posts={posts} admin />
		</>
	);
};

const CreateNewPost = () => {
	const router = useRouter();
	const { username } = useContext(UserContext);
	const [title, setTitle] = useState('');
	const slug = encodeURI(kebabCase(title));
	const isValid = title.length > 3 && title.length < 100;

	const createPost = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		const uid = auth.currentUser.uid;
		const ref = firestore
			.collection('users')
			.doc(uid)
			.collection('posts')
			.doc(slug);

		const data = {
			title,
			slug,
			uid,
			username,
			published: false,
			content: '# Hello World',
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
			heartCount: 0,
		};

		await ref.set(data);
		toast.success('Post Created!');

		router.push(`/admin/${slug}`);
	};

	return (
		<form onSubmit={createPost}>
			<input
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder='New Article'
				className={styles.input}
			/>
			<p>
				<strong>Slug:</strong>
				{slug}
			</p>
			<button type='submit' disabled={!isValid} className='btn-green'>
				Create New Post
			</button>
		</form>
	);
};

export default AdminPage;
