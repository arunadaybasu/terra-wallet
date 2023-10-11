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
  const [govProp, setGovProp] = useState({
    content: {title: '', description: ''},
    deposit_end_time: '',
    final_tally_result: 
    {
      yes: '',
      no: '',
      abstain: '',
      no_with_veto: ''
    },
    id: '',
    status: '',
    submit_time: '',
    total_deposit: {_coins: {uluna: ''}},
    voting_end_time: '',
    voting_start_time: ''
  });

  const propStatus = [
    'Unknown',
    'Depositing',
    'Voting',
    'Accepted',
    'Declined',
    'Disallowed'
  ];
  const propTypes = {
    'TextProposal': 'Text - does not need a Community Pool; generally used as a signalling proposal',
    'CommunityPoolSpendProposal': 'Community Pool Spend - the Community Pool will be deducted for the mentioned amount; proposers generally discuss proposals on a discussion forum before a Community Pool spend',
    'ParameterChangeProposal': 'Parameter Change - this proposal will change paramaters on the blockchain; proposers generally discuss proposals on a discussion forum before effecting a parameter change',
    'SoftwareUpgradeProposal': 'Software Upgrade - this proposal will upgrade the current software version(s) of the blockchain; proposers generally discuss proposals on a discussion forum before effecting a blockchain software upgrade',
  };

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

  function getProposalTimes(propTemp) {

    const dateTemp = new Date(propTemp.deposit_end_time);
    console.log(dateTemp.toDateString(), dateTemp.toLocaleString(), dateTemp.toUTCString(), dateTemp.toTimeString());

  }

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
        getProposalTimes(govProposal);

        const govProposalTemp = govProposal.toJSON();
        const propTypeTemp = govProposalTemp.split(':')[2].split('"')[1].split('.')[3];
        console.log(propTypes[propTypeTemp]);

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

  useEffect(() => {

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
        
          <Box textAlign="left">
            <Link href="/proposals" _hover={{ textDecoration: 'none' }}>
              <Button colorScheme='blue'>Back</Button>
            </Link>
          </Box>

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
