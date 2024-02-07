import { useRouter } from 'next/router';

export const IndexPage = () => {
    const router = useRouter();
    router.push('/metadata/products');
};

export default IndexPage;
