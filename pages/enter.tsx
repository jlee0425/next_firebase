import React, { useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { UserContext } from '../utils/context';
import { auth, firestore, googleAuthProvider } from '../utils/firebase';
import debounce from 'lodash.debounce';

export default function Enter() {
	const { user, username } = useContext(UserContext);

	return (
		<main>
			<h1>Sign up Page</h1>
			{user ? !username ? <UsernameForm /> : <SignOutBtn /> : <SignInBtn />}
		</main>
	);
}

const SignInBtn = () => {
	const signInWithGoogle = async () => {
		try {
			await auth.signInWithPopup(googleAuthProvider);
		} catch (error) {
			toast.error('Error');
		}
	};
	return (
		<button className='btn-google' onClick={signInWithGoogle}>
			<img src={'/google.png'} /> Sign in with Google
		</button>
	);
};

const SignOutBtn = () => (
	<button onClick={() => auth.signOut()}>Sign Out</button>
);

const UsernameForm = () => {
	const [formValue, setFormValue] = useState('');
	const [isValid, setIsValid] = useState(false);
	const [loading, setLoading] = useState(false);

	const { user, username } = useContext(UserContext);

	const onChange = (e) => {
		const val = e.target.value.toLowerCase();
		const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

		if (val.length < 3) {
			setFormValue(val);
			setLoading(false);
			setIsValid(false);
		}
		if (re.test(val)) {
			setFormValue(val);
			setLoading(true);
			setIsValid(false);
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault(); // disable auto page refresh

		const userDoc = firestore.doc(`users/${user.uid}`);
		const usernameDoc = firestore.doc(`usernames/${formValue}`);

		const batch = firestore.batch();
		batch.set(userDoc, {
			username: formValue,
			photoURL: user.photoUrl,
			displayName: user.displayName,
		});
		batch.set(usernameDoc, { uid: user.uid });

		await batch.commit();
	};

	useEffect(() => {
		checkUsername(formValue);
	}, [formValue]);

	const checkUsername = useCallback(
		debounce(async (username) => {
			if (username.length >= 3) {
				const ref = firestore.doc(`usernames/${username}`);
				const { exists } = await ref.get();
				console.log('Firestore read executed!');
				setIsValid(!exists);
				setLoading(false);
			}
		}, 500),
		[],
	);

	return (
		!username && (
			<section>
				<h3>Choose Username</h3>
				<form onSubmit={onSubmit}>
					<input
						name='username'
						placeholder='username'
						value={formValue}
						onChange={onChange}
					/>
					<UsernameMessage
						username={formValue}
						isValid={isValid}
						loading={loading}
					/>
					<button type='submit' className='btn-green' disabled={!isValid}>
						Submit
					</button>

					<h3>Debug State</h3>
					<div>
						Username: {formValue}
						<br />
						Loading: {loading.toString()}
						<br />
						Username Valid: {isValid.toString()}
					</div>
				</form>
			</section>
		)
	);
};

const UsernameMessage = ({ username, isValid, loading }) => {
	if (loading) {
		return <p>Checking...</p>;
	} else if (isValid) {
		return <p className='text-success'>{username} is available!</p>;
	} else if (username && !isValid) {
		return <p className='text-danger'>That username is taken!</p>;
	} else {
		return <p></p>;
	}
};
