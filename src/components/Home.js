import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import { getAssets } from '@/libraries/ajax';
import {
  Spinner,
  Card,
  CardBody,
  CardFooter,
  Image,
  Text,
  Wrap,
  WrapItem,
  Flex,
  Center,
} from '@chakra-ui/react';

const Home = () => {
  const [data, setData] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isAPIFailed, setIsAPIFailed] = useState(false);
  const moreDataObserverRef = useRef(null);
  const timerRef = useRef(null);

  const getData = useCallback((query) => {
    getAssets(query)
      .then((res) => {
        const newData = res?.data?.assets || [];
        if (query?.cursor) {
          setData((preData) => [...preData, ...newData]);
        } else {
          setData(newData);
        }
        setHasNextPage(res?.data?.next);
        setIsAPIFailed(false);
      })
      .catch(() => {
        setData([]);
        setIsAPIFailed(true);
      });
  }, []);

  const getAssetRef = useCallback(
    (node) => {
      if (node) {
        const isLastAsset =
          node.getAttribute('data-asset-index') === String(data.length - 1);
        if (isLastAsset) {
          moreDataObserverRef.current?.disconnect();
          moreDataObserverRef.current = new IntersectionObserver(
            (entry) => {
              if (entry[0].isIntersecting && !!hasNextPage && !isAPIFailed) {
                timerRef.current = setTimeout(() => {
                  getData({ cursor: hasNextPage });
                }, 600);
              }
            },
            { threshold: 1, rootMargin: '0px 0px -50px 0px' }
          );
          moreDataObserverRef.current?.observe(node);
        }
      }

      return null;
    },
    [data, getData, hasNextPage, isAPIFailed]
  );

  const cards = useMemo(
    () =>
      data.map((item, index) => (
        <WrapItem key={`${item.id}-${index}`}>
          <Card
            ref={getAssetRef}
            data-asset-index={index}
            w='200px'
            h='250px'
            bg='gray.200'
            margin='5px'
            cursor='pointer'
            _hover={{ backgroundColor: '#BEE3F8' }}
          >
            <CardBody overflow='hidden' paddingBottom='0'>
              <Center>
                <Image
                  src={item.image_url}
                  alt='No Data'
                  borderRadius='lg'
                  w='80%'
                  h='auto'
                  objectFit='cover'
                />
              </Center>
            </CardBody>
            <CardFooter justify='center'>
              <Text
                fontSize='1.2rem'
                as='b'
                align='center'
                overflow='hidden'
                textOverflow='ellipsis'
                whiteSpace='nowrap'
              >
                {item.name || 'Loading...'}
              </Text>
            </CardFooter>
          </Card>
        </WrapItem>
      )),
    [data, getAssetRef]
  );

  const loading = useMemo(
    () => (data.length === 0 || hasNextPage) && <Spinner />,
    [data, hasNextPage]
  );

  useEffect(() => {
    getData();
    return () => {
      clearTimeout(timerRef.current);
    };
  }, [getData]);

  return (
    <Flex direction='column' justify='center'>
      <Text
        fontSize='2rem'
        as='b'
        align='center'
        color='gray.600'
        margin='20px 0'
      >
        All Assets
      </Text>
      <Wrap justify='center'>{cards}</Wrap>
      <Flex justify='center' margin='20px 0'>
        {loading}
      </Flex>
    </Flex>
  );
};

export default Home;
