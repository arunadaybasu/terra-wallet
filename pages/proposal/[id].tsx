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
  const [govProp, setGovProp] = useState(null);

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

  useEffect(() => {

      async function getProposal(propIdTemp) {

        console.log(propIdTemp);

        if (propIdTemp != undefined)
        {

          try {

            const terra = new LCDClient({
              URL: 'https://columbus-lcd.terra.dev',
              chainID: 'columbus-5',
              isClassic: true
            });

            const govProposal = await terra.gov.proposal(propIdTemp, {});
            setGovProp(govProposal);
            console.log(govProposal);

            return;

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

        return;

      }
      console.log(propId);
      getProposal(propId);

      return;
  }, [propId]);

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

          <SimpleGrid columns={2} spacing={10}>
            <Box textAlign="left">
              <Text fontSize='3xl'>
                Proposal No. #{govProp.id}
              </Text>
              <Text fontSize='2xl'>
                {govProp.content.title}
              </Text>
              <Text fontSize='lg'>
                {govProp.content.description}
              </Text>
            </Box>
            <Box textAlign="center">
              <Button colorScheme='blue'>Vote Now</Button>
            </Box>            
          </SimpleGrid>

        </Container>

        <Box mb={3}>
          <Divider />
        </Box>

      </VStack>
  );
}
