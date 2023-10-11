import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LCDClient, Coin } from '@terra-money/terra.js';

import Head from 'next/head';

import { useChain, useManager } from '@cosmos-kit/react';
import { chainName } from '../../config';
import {
  useColorMode, useColorModeValue,
  Container, Grid, SimpleGrid, VStack, Flex, Box, Stack,
  Heading, Divider, StackDivider, Icon,
  Text, Link,
  Button,
  Card, CardHeader, CardBody, CardFooter,
} from '@chakra-ui/react';

import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs';

import { WalletSection } from '../../components';

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  const {
    connect,
    openView,
    status,
    username,
    address,
    message,
    wallet,
    chain: chainInfo,
  } = useChain(chainName);
  const { getChainLogo } = useManager();

  const router = useRouter();
  const propId = router.query.id;
  
  const [govProp, setGovProp] = useState(null);
  const [govPropOnly, setGovPropOnly] = useState(null);
  // const [propId, setPropId] = useState(router.query.id);

  async function getProposal() {
    try {

      const terra = new LCDClient({
        URL: 'https://columbus-lcd.terra.dev',
        chainID: 'columbus-5',
        isClassic: true
      });

      // const paginationOptions = {
      //   'pagination.limit': '20',
      //   'pagination.offset': '0',
      //   'pagination.key': '',
      //   'pagination.count_total': 'true',
      //   'pagination.reverse': 'true'
      // };
      console.log(propId);
      const params = {
        'proposalId': propId
      }

      // const govProposal = await terra.gov.proposal(params);
      // setGovProp(govProposal);

      // const proposalOnly = govProposal[0];
      // setGovPropOnly(proposalOnly);

      // console.log(govProposal);

      // return govProposal;

    } catch (error) {
      if (error) {
        console.log('error message: ', error);
        return error;
      } else {
        console.log('unexpected error: ', error);
        return 'An unexpected error occurred';
      }
    }
  }

  useEffect(() => {

      // console.log(propId);

      // async function getBalance() {
      //   try {

      //     const terra = new LCDClient({
      //       URL: 'https://columbus-lcd.terra.dev',
      //       chainID: 'columbus-5',
      //       isClassic: true
      //     });

      //     const balance = await terra.bank.balance('terra162xv4hyl3nz66lakj0dmnczcjmjmrkdpqf7jw0');
      //     // console.log(balance);
      //     console.log(JSON.stringify(balance));

      //     return balance;

      //   } catch (error) {
      //     if (error) {
      //       console.log('error message: ', error);
      //       return error;
      //     } else {
      //       console.log('unexpected error: ', error);
      //       return 'An unexpected error occurred';
      //     }
      //   }
      // }
      // getBalance();

      getProposal();

      return;
  }, []);

  return (
      <VStack spacing={4} align='stretch'>
        <Head>
          <title>Terra Luna Classic Wallet</title>
          <meta name="description" content="Community Wallet for Terra Luna Classic" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <SimpleGrid bg='gray.200' height='80px' columns={2} spacing={10}>

          <Box>
            {/*<Heading as="h1" fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }} fontWeight="extrabold" mb={3}>Terra Luna Classic Wallet</Heading>*/}
            <Heading as="h1" fontWeight="bold" fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }} >
              <Text as="span" color={useColorModeValue('primary.500', 'primary.200')}>Terra</Text>
              <Text as="span">Wallet&nbsp;</Text>
            </Heading>
          </Box>

          <Box>
            <WalletSection />
            <Button variant="outline" px={0} onClick={toggleColorMode}>
              <Icon as={colorMode === 'light' ? BsFillMoonStarsFill : BsFillSunFill} />
            </Button>
          </Box>
          
        </SimpleGrid>

        <Container maxW="5xl" py={10}>

          <SimpleGrid columns={4} spacing={10}>
            {/*govPropsOnly && govPropsOnly.map(function(govProp) {
              return (
                <Card key={govProp.id}>
                  <CardHeader>
                    <Heading size='md'>Prop #{govProp.id}</Heading>
                  </CardHeader>

                  <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                      <Box>
                        <Heading size='xs' textTransform='uppercase'>
                          Title
                        </Heading>
                        <Text pt='2' fontSize='sm'>
                          {govProp.content.title}
                        </Text>
                      </Box>
                      <Box>
                        <Heading size='xs' textTransform='uppercase'>
                          Status
                        </Heading>
                        <Text pt='2' fontSize='sm'>
                          {govProp.status}
                        </Text>
                      </Box>
                    </Stack>
                  </CardBody>
                </Card>
              )
            })*/}
          </SimpleGrid>

          <Box textAlign="center">
            <Button colorScheme='blue'>Load More Proposals</Button>
          </Box>

        </Container>

        <Box mb={3}>
          <Text pt='2' fontSize='sm'>
            {propId}
          </Text>
          <Divider />
        </Box>

      </VStack>
  );
}
