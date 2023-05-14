import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import routerPath from '@/libraries/routerPath';
import { ChakraProvider, Spinner } from '@chakra-ui/react';

const Home = lazy(() => import('@/components/Home'));
const Detail = lazy(() => import('@/components/Detail'));

const App = () => {
  return (
    <ChakraProvider>
      <BrowserRouter basename={process.env.PUBLIC_PATH}>
        <Suspense fallback={<Spinner />}>
          <Route exact path={routerPath.ROOT}>
            <Home />
          </Route>
          <Route path={routerPath.DETAIL}>
            <Detail />
          </Route>
        </Suspense>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
