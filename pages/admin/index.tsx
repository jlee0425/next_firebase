import React from 'react';
import Metatags from '../../components/Metatags';

interface Props {}

const AdminPage = (props: Props) => {
	return (
		<main>
			<Metatags title='admin page' />
			<h1>Admin Page</h1>
		</main>
	);
};

export default AdminPage;
