import Link from 'next/link';
import React, { useContext } from 'react';
import { UserContext } from '../utils/context';

interface Props {
	fallback?: JSX.Element;
	children: any;
}

const AuthCheck = (props: Props) => {
	const { username } = useContext(UserContext);
	return username
		? props.children
		: props.fallback || <Link href='/enter'>You must be signed in</Link>;
};

export default AuthCheck;
