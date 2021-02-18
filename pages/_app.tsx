import '../styles/globals.css';
import { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { UserContext } from '../utils/context';
import { useUserData } from '../utils/hooks';

const MyApp = ({ Component, pageProps }: AppProps) => {
	const userData = useUserData();
	return (
		<UserContext.Provider value={userData}>
			<Navbar />
			<Component {...pageProps} />
			<Toaster />
		</UserContext.Provider>
	);
};

export default MyApp;
