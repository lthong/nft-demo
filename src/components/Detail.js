import React, { useCallback, useEffect, useState } from 'react';
import {
  Flex,
  Text,
  Spinner,
  Image,
  Button,
  Box,
  Center,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useParams, useHistory } from 'react-router-dom';
import { getAssetDetail } from '@/libraries/ajax';

const Detail = () => {
  const { assetContractAddress, tokenId } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const history = useHistory();

  const getData = useCallback(() => {
    if (assetContractAddress && tokenId) {
      setLoading(true);
      getAssetDetail({ assetContractAddress, tokenId })
        .then((res) => {
          setData(res?.data || {});
        })
        .catch(() => {
          setData({});
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [assetContractAddress, tokenId]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Flex direction='column' justify='center' padding='20px 10px'>
      {loading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <>
          <Flex
            marginBottom='20px'
            justifyContent='space-space'
            alignItems='center'
            fontSize='1.6rem'
            color='gray.600'
          >
            <ChevronLeftIcon
              boxSize='60px'
              cursor='pointer'
              onClick={() => {
                history.push('/');
              }}
            />
            <Text as='b' whiteSpace='nowrap' flex='1' align='center'>
              {data.collection?.name || 'Loading...'}
            </Text>
            <Box w='60px' />
          </Flex>
          {/* TODO: check the spec of desktop UI */}
          <Image
            src={data.image_url}
            alt='No Data'
            w='100%'
            h='auto'
            objectFit='cover'
          />
          <Text
            fontSize='1.6rem'
            as='b'
            align='center'
            color='gray.600'
            margin='10px 0'
          >
            {data.name}
          </Text>
          <Text
            fontSize='1.4rem'
            align='center'
            color='gray.400'
            marginBottom='30px'
          >
            {data.description}
          </Text>
          <Center>
            {data.permalink && (
              <Button
                colorScheme='blue'
                margin='10px 0 20px'
                onClick={() => {
                  window.location.replace(data.permalink);
                }}
              >
                Permalink
              </Button>
            )}
          </Center>
        </>
      )}
    </Flex>
  );
};

export default Detail;
