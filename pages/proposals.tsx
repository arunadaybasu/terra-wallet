import React, { useState, useEffect } from 'react';
import { LCDClient, Coin } from '@terra-money/terra.js';

import Head from 'next/head';

import { useChain, useManager } from '@cosmos-kit/react';
import { chainName } from '../config';
import {
  useColorMode, useColorModeValue,
  Container, Grid, SimpleGrid, VStack, Flex, Box, Stack,
  Heading, Divider, StackDivider, Icon,
  Text, Link,
  Button,
  Tabs, TabList, TabPanels, Tab, TabPanel
} from '@chakra-ui/react';
import { LinkIcon } from '@chakra-ui/icons';

import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs';

import { WalletSection } from '../components';

export default function Home() {
  const [govProps, setGovProps] = useState(null);
  const [govPropsOnly, setGovPropsOnly] = useState(null);
  const [nextKey, setNextKey] = useState('');
  const [totalProps, setTotalProps] = useState('');

  const propStatus = [
    'Unknown',
    'Depositing',
    'Voting',
    'Accepted',
    'Declined',
    'Disallowed'
  ];

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
  const { colorMode, toggleColorMode } = useColorMode();

  function getBoxShadow() {
    return useColorModeValue(
      '0 2px 5px #ccc',
      '0 1px 3px #727272, 0 2px 12px -2px #2f2f2f'
    );
  }

  function getBoxShadowHover() {
    return {
      color: useColorModeValue('purple.600', 'purple.300'),
      boxShadow: useColorModeValue(
        '0 2px 5px #bca5e9',
        '0 0 3px rgba(150, 75, 213, 0.8), 0 3px 8px -2px rgba(175, 89, 246, 0.9)'
      )
    };
  }

  async function getProposals() {
    try {

      const terra = new LCDClient({
        URL: 'https://columbus-lcd.terra.dev',
        chainID: 'columbus-5',
        isClassic: true
      });

      const paginationOptions = {
        'pagination.limit': '20',
        'pagination.offset': '0',
        'pagination.key': '',
        'pagination.count_total': 'true',
        'pagination.reverse': 'true'
      };

      const govProposals = await terra.gov.proposals(paginationOptions);
      setGovProps(govProposals);

      const proposalsOnly = govProposals[0];
      setGovPropsOnly(proposalsOnly);

      console.log(govProposals[1].next_key, govProposals[1].total);
      setNextKey(govProposals[1].next_key);
      setTotalProps(govProposals[1].total);

      return govProposals;

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

  async function loadMoreProposals() {
    try {

      const terra = new LCDClient({
        URL: 'https://columbus-lcd.terra.dev',
        chainID: 'columbus-5',
        isClassic: true
      });

      const paginationOptions = {
        'pagination.limit': '20',
        'pagination.offset': '0',
        'pagination.key': nextKey,
        'pagination.count_total': 'true',
        'pagination.reverse': 'true'
      };

      const govProposals = await terra.gov.proposals(paginationOptions);
      setGovProps(govProposals);
      console.log(govProposals);

      const proposalsOnly = govProposals[0];
      setGovPropsOnly(proposalsOnly);

      console.log(govProposals[1].next_key, govProposals[1].total);
      setNextKey(govProposals[1].next_key);

      return govProposals;

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

      console.log(address);
      
      getProposals();

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

        <Container maxW="6xl" py={10}>

          <Box textAlign="right">
            <Button onClick={loadMoreProposals} colorScheme='blue'>Load Older Proposals</Button>
          </Box>

          <Tabs>
            <TabList>
              <Tab key="propTab1">Depositing</Tab>
              <Tab key="propTab2">Voting</Tab>
              <Tab key="propTab3">Accepted</Tab>
              <Tab key="propTab4">Declined</Tab>
              <Tab key="propTab5">Disallowed</Tab>
              <Tab key="propTab0">Unknown</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <SimpleGrid columns={3} spacing={10}>
                  {govPropsOnly && govPropsOnly.map(function(govProp) {
                    if (govProp.status == '1')
                      return (
                        <Link key={govProp.id} href={"/proposal/" + govProp.id} _hover={{ textDecoration: 'none' }}>
                          <Stack
                            h="full"
                            minH={36}
                            p={5}
                            spacing={2.5}
                            justifyContent="center"
                            borderRadius={5}
                            boxShadow={getBoxShadow}
                            _hover={getBoxShadowHover}
                          >
                            <Heading noOfLines={2} fontSize="xl">{govProp.content.title}&ensp;&rarr;</Heading>
                            <Text>{propStatus[govProp.status]}</Text>
                            <Text noOfLines={5}>{govProp.content.description}</Text>
                          </Stack>
                        </Link>
                      )
                  })}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={3} spacing={10}>
                  {govPropsOnly && govPropsOnly.map(function(govProp) {
                    if (govProp.status == '2')
                      return (
                        <Link key={govProp.id} href={"/proposal/" + govProp.id} _hover={{ textDecoration: 'none' }}>
                          <Stack
                            h="full"
                            minH={36}
                            p={5}
                            spacing={2.5}
                            justifyContent="center"
                            borderRadius={5}
                            boxShadow={getBoxShadow}
                            _hover={getBoxShadowHover}
                          >
                            <Heading noOfLines={2} fontSize="xl">{govProp.content.title}&ensp;&rarr;</Heading>
                            <Text>{propStatus[govProp.status]}</Text>
                            <Text noOfLines={5}>{govProp.content.description}</Text>
                          </Stack>
                        </Link>
                      )
                  })}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={3} spacing={10}>
                  {govPropsOnly && govPropsOnly.map(function(govProp) {
                    if (govProp.status == '3')
                      return (
                        <Link key={govProp.id} href={"/proposal/" + govProp.id} _hover={{ textDecoration: 'none' }}>
                          <Stack
                            h="full"
                            minH={36}
                            p={5}
                            spacing={2.5}
                            justifyContent="center"
                            borderRadius={5}
                            boxShadow={getBoxShadow}
                            _hover={getBoxShadowHover}
                          >
                            <Heading noOfLines={2} fontSize="xl">{govProp.content.title}&ensp;&rarr;</Heading>
                            <Text>{propStatus[govProp.status]}</Text>
                            <Text noOfLines={5}>{govProp.content.description}</Text>
                          </Stack>
                        </Link>
                      )
                  })}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={3} spacing={10}>
                  {govPropsOnly && govPropsOnly.map(function(govProp) {
                    if (govProp.status == '4')
                      return (
                        <Link key={govProp.id} href={"/proposal/" + govProp.id} _hover={{ textDecoration: 'none' }}>
                          <Stack
                            h="full"
                            minH={36}
                            p={5}
                            spacing={2.5}
                            justifyContent="center"
                            borderRadius={5}
                            boxShadow={getBoxShadow}
                            _hover={getBoxShadowHover}
                          >
                            <Heading noOfLines={2} fontSize="xl">{govProp.content.title}&ensp;&rarr;</Heading>
                            <Text>{propStatus[govProp.status]}</Text>
                            <Text noOfLines={5}>{govProp.content.description}</Text>
                          </Stack>
                        </Link>
                      )
                  })}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={3} spacing={10}>
                  {govPropsOnly && govPropsOnly.map(function(govProp) {
                    if (govProp.status == '5')
                      return (
                        <Link key={govProp.id} href={"/proposal/" + govProp.id} _hover={{ textDecoration: 'none' }}>
                          <Stack
                            h="full"
                            minH={36}
                            p={5}
                            spacing={2.5}
                            justifyContent="center"
                            borderRadius={5}
                            boxShadow={getBoxShadow}
                            _hover={getBoxShadowHover}
                          >
                            <Heading noOfLines={2} fontSize="xl">{govProp.content.title}&ensp;&rarr;</Heading>
                            <Text>{propStatus[govProp.status]}</Text>
                            <Text noOfLines={5}>{govProp.content.description}</Text>
                          </Stack>
                        </Link>
                      )
                  })}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={3} spacing={10}>
                  {govPropsOnly && govPropsOnly.map(function(govProp) {
                    if (govProp.status == '0')
                      return (
                        <Link key={govProp.id} href={"/proposal/" + govProp.id} _hover={{ textDecoration: 'none' }}>
                          <Stack
                            h="full"
                            minH={36}
                            p={5}
                            spacing={2.5}
                            justifyContent="center"
                            borderRadius={5}
                            boxShadow={getBoxShadow}
                            _hover={getBoxShadowHover}
                          >
                            <Heading noOfLines={2} fontSize="xl">{govProp.content.title}&ensp;&rarr;</Heading>
                            <Text>{propStatus[govProp.status]}</Text>
                            <Text noOfLines={5}>{govProp.content.description}</Text>
                          </Stack>
                        </Link>
                      )
                  })}
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>

        </Container>

        <Box mb={3}>
          <Divider />
        </Box>

      </VStack>
  );
}
