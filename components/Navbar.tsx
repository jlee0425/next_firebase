import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../utils/context';

const Navbar = () => {
	const { user, username } = useContext(UserContext);

	return (
		<nav className='navbar'>
			<ul>
				<li>
					<Link href='/'>
						<button className='btn-logo'>FEED</button>
					</Link>
				</li>
				{/* user is signed in and has username */}
				{username && (
					<>
						<li className='push-left'>
							<button onClick={() => {}}>Sign Out</button>
						</li>
						<li>
							<Link href='/admin'>
								<button className='btn-blue'>Write Posts</button>
							</Link>
						</li>
						<li>
							<Link href={'/${username}'}>
								<img src={user?.photoUrl} />
							</Link>
						</li>
					</>
				)}
				{/* user is not signed OR has not created username */}
				{!username && (
					<li>
						<Link href='/enter'>
							<button className='btn-blue'>Log in</button>
						</Link>
					</li>
				)}
			</ul>
		</nav>
	);
};

export default Navbar;