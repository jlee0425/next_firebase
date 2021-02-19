import React from 'react';

export interface UserProps {
	uid: string;
	username: string;
	displayName: string;
	photoURL: string;
}

const UserProfile = (user: UserProps) => {
	return (
		<div className='box-center'>
			<img
				src={user.photoURL}
				alt='User Profile Photo'
				className='card-img-center'
			/>
			<p>
				<i>@{user.username}</i>
			</p>
			<h1>{user.displayName}</h1>
		</div>
	);
};

export default UserProfile;
