import Head from 'next/head';

interface Props {
	title?: string;
	description?: string;
	image?: string;
}

const Metatags = ({
	title = 'Next.js + Firebase',
	description = 'Following the course by fireship.io',
	image = 'https://fireship.io/courses/react-next-firebase/img/featured.png',
}: Props) => {
	return (
		<Head>
			<title>{title}</title>
			<meta name='twitter:card' content='summary' />
			<meta name='twitter:site' content='@fireship_dev' />
			<meta name='twitter:title' content={title} />
			<meta name='twitter:description' content={description} />
			<meta name='twitter:image' content={image} />

			<meta property='og:title' content={title} />
			<meta property='og:description' content={description} />
			<meta property='og:image' content={image} />
		</Head>
	);
};

export default Metatags;
