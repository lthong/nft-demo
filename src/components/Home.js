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
  ButtonGroup,
  Button,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider);
const randomAccount = web3.eth.accounts.create(); // for demo

const ownerTypeEnum = {
  default: 'default',
  random: 'random',
};
const ownerAddressEnum = {
  default: process.env.OWNER_KEY,
  random: randomAccount.address,
};
const ownerTypeConfig = Object.keys(ownerTypeEnum).map((key) => ({
  key,
  label: `${key} address`,
}));

const Home = () => {
  const [data, setData] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [isAPIFailed, setIsAPIFailed] = useState(false);
  const [ownerType, setOwnerType] = useState(ownerTypeEnum.default);
  const moreDataObserverRef = useRef(null);
  const timerRef = useRef(null);
  const history = useHistory();

  const getData = useCallback((query = {}) => {
    getAssets(query)
      .then((res) => {
        const newData = res?.data?.assets || [];
        if (query?.cursor) {
          setData((preData) => [...preData, ...newData]);
        } else {
          setData(newData);
        }
        setNextPage(res?.data?.next);
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
              if (entry[0].isIntersecting && !!nextPage && !isAPIFailed) {
                timerRef.current = setTimeout(() => {
                  getData({
                    cursor: nextPage,
                    owner: ownerAddressEnum[ownerType],
                  });
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
    [data, getData, nextPage, isAPIFailed, ownerType]
  );

  const cards = useMemo(
    () =>
      data.map((item, index) => (
        <WrapItem key={`${item.id}-${index}`}>
          <Card
            ref={getAssetRef}
            data-asset-index={index}
            w={{ sm: '200px', base: '42vw' }}
            h='250px'
            bg='gray.200'
            margin='5px'
            cursor='pointer'
            _hover={{ backgroundColor: '#BEE3F8' }}
            onClick={() => {
              history.push(
                `/detail/${item.asset_contract?.address}/${item.token_id}`
              );
            }}
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
            <CardFooter justify='center' paddingTop='0'>
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
    [data, getAssetRef, history]
  );

  useEffect(() => {
    getData({
      owner: ownerAddressEnum[ownerType],
    });
  }, [getData, ownerType]);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

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
      <ButtonGroup
        variant='outline'
        spacing='6'
        display='flex'
        justifyContent='center'
        marginBottom='20px'
      >
        {ownerTypeConfig.map(({ key, label }) => (
          <Button
            key={key}
            isActive={ownerType === key}
            onClick={() => {
              setOwnerType(ownerTypeEnum[key]);
            }}
            textTransform='capitalize'
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>
      <Wrap justify='center'>{cards}</Wrap>
      <Flex justify='center' margin='20px 0'>
        {data.length === 0 && (
          <Text fontSize='1.4rem' align='center' color='gray.400'>
            No Data
          </Text>
        )}
        {nextPage && <Spinner />}
      </Flex>
    </Flex>
  );
};

export default Home;
