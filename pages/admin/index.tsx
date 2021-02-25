import React from 'react';
import AuthCheck from '../../components/AuthCheck';
import Metatags from '../../components/Metatags';

interface Props {}

const AdminPage = (props: Props) => {
	return (
		<main>
			<AuthCheck>
				<Metatags title='admin page' />
				<h1>Admin Page</h1>
			</AuthCheck>
		</main>
	);
};

export default AdminPage;
