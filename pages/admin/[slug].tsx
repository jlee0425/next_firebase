import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { auth, firestore, serverTimestamp } from '../../utils/firebase';
import styles from '../../styles/Admin.module.css';
import { Post } from '../../components/PostFeed';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface FormProps {
	content: string;
	published: boolean;
}

const AdminEditPage = () => {
	return (
		<main>
			<PostManager />
		</main>
	);
};

const PostManager = () => {
	const [preview, setPreview] = useState(false);
	const router = useRouter();
	const { slug } = router.query;
	const postRef = firestore
		.collection('users')
		.doc(auth.currentUser.uid)
		.collection('posts')
		.doc(slug as string);

	const [post] = useDocumentDataOnce<Post>(postRef);

	return (
		<main className={styles.container}>
			{post && (
				<>
					<section>
						<h1>{post.title}</h1>
						<p>ID: {post.slug}</p>
						<PostForm
							postRef={postRef}
							defaultValues={post}
							preview={preview}
						/>
					</section>
					<aside>
						<h3>Tools</h3>
						<button onClick={() => setPreview(!preview)}>
							{preview ? 'Edit' : 'Preview'}
						</button>
						<Link href={`/${post.username}/${post.slug}`}>
							<button className='btn-blue'>Live View</button>
						</Link>
					</aside>
				</>
			)}
		</main>
	);
};

const PostForm = ({ defaultValues, postRef, preview }) => {
	const { register, handleSubmit, reset, watch } = useForm<FormProps>({
		defaultValues,
		mode: 'onChange',
	});

	const updatePost = async ({ content, published }) => {
		await postRef.update({
			content,
			published,
			updatedAt: serverTimestamp(),
		});

		reset({ content, published });
		toast.success('Post Updated!');
	};

	return (
		<form onSubmit={handleSubmit(updatePost)}>
			{preview && (
				<div className='card'>
					<ReactMarkdown>{watch('content')}</ReactMarkdown>
				</div>
			)}
			<div className={preview ? styles.hidden : styles.controls}>
				<textarea name='content' ref={register}></textarea>
				<fieldset>
					<input
						type='checkbox'
						className={styles.checkbox}
						name='published'
						ref={register}
					/>
					<label>Published</label>
				</fieldset>
				<button type='submit' className='btn-green'>
					Save Changes
				</button>
			</div>
		</form>
	);
};

export default AdminEditPage;
