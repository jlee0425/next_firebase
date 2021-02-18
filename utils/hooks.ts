import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from './firebase';

export const useUserData = () => {
	const [user] = useAuthState(auth);
	const [username, setUsername] = useState(null);

	useEffect(() => {
		// turn off realtime subscription
		let unsubscribe;
		if (user) {
			const ref = firestore.collection('users').doc(user.uid);
			console.log('context user', user);
			console.log('context ref', ref);
			unsubscribe = ref.onSnapshot((doc) => {
				console.log('Current data: ', doc, doc.data());
				setUsername(doc.data()?.username);
			});
		} else {
			setUsername(null);
		}

		return unsubscribe;
	}, [user]);

	return { user, username };
};
