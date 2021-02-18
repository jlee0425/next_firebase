import Link from 'next/link';
import React from 'react';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import styles from '../styles/Home.module.css';

const Home = (): JSX.Element => {
	return (
		<div className={styles.container}>
			<button onClick={() => toast.success('hello toast!')}>Toast Me!</button>
			<Loader show={true} />
			<Link
				prefetch={false}
				href={{ pathname: '/[username]', query: { username: 'Runa' } }}
			>
				<a>Jake's profile</a>
			</Link>
		</div>
	);
};

export default Home;
