import React, { useState, useEffect } from 'react';
import { LCDClient, Coin } from '@terra-money/terra.js';

import Head from 'next/head';

import {
  SimpleGrid,
  VStack,
  Box,
  Divider,
  Grid,
  Heading,
  Text,
  Stack,
  Link,
  Button,
  Flex,
  Icon,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';

import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs';

import { WalletSection } from '../components';

export default function Home() {
  
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {

      console.log('---------should execute only once, max twice');

      async function getBalance() {
        try {

          // connect to columbus-5 terra classic network
          const terra = new LCDClient({
            URL: 'https://columbus-lcd.terra.dev',
            chainID: 'columbus-5',
            isClassic: true  // *set to true to connect terra-classic chain*
          });

          const balance = await terra.bank.balance('terra162xv4hyl3nz66lakj0dmnczcjmjmrkdpqf7jw0');
          // console.log(balance);

          console.log(JSON.stringify(balance, null, 4));

          return balance;

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
      getBalance();

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

        <Box textAlign="center">
        </Box>

        <Box mb={3}>
          <Divider />
        </Box>

      </VStack>
  );
}
