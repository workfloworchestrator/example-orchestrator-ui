import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

const useFetchInterceptor = () => {
  useEffect(() => {
    const handleResponse = (response: Response) => {
      if (response.status === 401) {
        const currentUrl = window.location.href;
        signOut({ callbackUrl: `/api/auth/signin?error=SessionRequired&callbackUrl=${encodeURIComponent(currentUrl)}` });
      }
      return response;
    };

    const originalFetch = global.fetch.bind(global);

    global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await originalFetch(input, init);
      return handleResponse(response);
    };

    return () => {
      global.fetch = originalFetch;
    };
  }, []);
};

export default useFetchInterceptor;
