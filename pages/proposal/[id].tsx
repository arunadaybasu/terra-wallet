import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LCDClient, Coin } from '@terra-money/terra.js';

import Head from 'next/head';

import { useChain, useManager } from '@cosmos-kit/react';
import { chainName } from '../../config';
import {
  useColorMode, useColorModeValue,
  Container, Grid, SimpleGrid, VStack, Flex, Box, Stack, Center,
  Heading, Divider, StackDivider, Icon,
  Text, Link,
  Button,
  Card, CardHeader, CardBody, CardFooter,
  Progress, CircularProgress, CircularProgressLabel,
  List, ListItem, ListIcon
} from '@chakra-ui/react';
import { CheckIcon, SmallCloseIcon } from '@chakra-ui/icons';

import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs';
import Countdown from "react-countdown";

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
  const [endDate, setEndDate] = useState(<></>);
  const [endDateLocale, setEndDateLocale] = useState('');
  const [propType, setPropType] = useState('');
  const [govTotalVoted, setTotalVoted] = useState('');
  const [propQuorum, setPropQuorum] = useState('');
  const [govQuorum, setGovQuorum] = useState('');
  const [govThreshold, setGovThreshold] = useState('');
  const [propThreshold, setPropThreshold] = useState('');
  const [govThresholdVeto, setGovThresholdVeto] = useState('');
  const [propThresholdVeto, setPropThresholdVeto] = useState('');
  const [passingColor, setPassingColor] = useState('');

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

  const getBoxShadow = useColorModeValue(
    '0 2px 5px #ccc',
    '0 1px 3px #727272, 0 2px 12px -2px #2f2f2f'
  );
  const getBoxShadowHover = {
    color: useColorModeValue('purple.600', 'purple.300'),
    boxShadow: useColorModeValue(
      '0 2px 5px #bca5e9',
      '0 0 3px rgba(150, 75, 213, 0.8), 0 3px 8px -2px rgba(175, 89, 246, 0.9)'
    )
  };

  const Completionist = () => {

    return (
      <Text fontSize="4xl">Voting has Ended</Text>
    );

  }

  const QuorumMsg = () => {

    if (propQuorum >= govQuorum)
      return (
        <ListItem>
          <ListIcon as={CheckIcon} color='green.500' />
          {govTotalVoted}% Stakers voting is MORE than Quorum of {govQuorum*100}%
        </ListItem>
      );
    else
      return (
        <ListItem>
          <ListIcon as={SmallCloseIcon} color='red.500' />
          {govTotalVoted}% Stakers voting is LESS than Quorum of {govQuorum*100}%
        </ListItem>
      );

  }

  const ThresholdMsg = () => {

    if (propThreshold > govThreshold)
      return (
        <ListItem>
          <ListIcon as={CheckIcon} color='green.500' />
          {(propThreshold*100).toFixed(2)}% Yes votes is MORE than Threshold of {govThreshold*100}%
        </ListItem>
      );
    else
      return (
        <ListItem>
          <ListIcon as={SmallCloseIcon} color='red.500' />
          {(propThreshold*100).toFixed(2)}% Yes votes is LESS than Threshold of {govThreshold*100}%
        </ListItem>
      );

  }

  const ThresholdVetoMsg = () => {

    if (propThresholdVeto < govThresholdVeto)
      return (
        <ListItem>
          <ListIcon as={CheckIcon} color='green.500' />
          {(propThresholdVeto*100).toFixed(2)}% No with Veto votes is LESS than Veto Threshold of {govThresholdVeto*100}%
        </ListItem>
      );
    else
      return (
        <ListItem>
          <ListIcon as={SmallCloseIcon} color='red.500' />
          {(propThresholdVeto*100).toFixed(2)}% No with Veto votes is MORE than Veto Threshold of {govThresholdVeto*100}%
        </ListItem>
      );

  }

  useEffect(() => {

      const propStatus = [
        'Unknown',
        'Depositing',
        'Voting',
        'Accepted',
        'Declined',
        'Disallowed'
      ];
      const propTypeNames = {
        'TextProposal': 'Text Proposal',
        'CommunityPoolSpendProposal': 'Community Pool Spend Proposal',
        'ParameterChangeProposal': 'Parameter Change Proposal',
        'SoftwareUpgradeProposal': 'Software Upgrade Proposal',
      };
      const propTypes = {
        'TextProposal': 'Text Proposal: Does not require a Community Pool spend. Generally used as a signalling proposal',
        'CommunityPoolSpendProposal': 'Community Pool Spend Proposal: The Community Pool will be deducted for the mentioned amount. Proposers generally discuss proposals on a discussion forum before a Community Pool spend',
        'ParameterChangeProposal': 'Parameter Change Proposal: This proposal will change paramaters on the blockchain. Proposers generally discuss proposals on a discussion forum before effecting a parameter change',
        'SoftwareUpgradeProposal': 'Software Upgrade Proposal: This proposal will upgrade the current software version(s) of the blockchain. Proposers generally discuss proposals on a discussion forum before effecting a blockchain software upgrade',
      };

      function getProposalTimes(propTemp: any) {

        if (propTemp.status == 1) {
          const dateTemp = new Date(propTemp.deposit_end_time);
          setEndDate(
            <Stack>
              <Box fontSize="6xl">
                <Countdown date={dateTemp.valueOf()}>
                  <Completionist />
                </Countdown>
              </Box>
              <Text fontSize="xl">DEPOSIT END DATE</Text>
              <Text fontSize="2xl">{dateTemp.toLocaleString()}</Text>
              <Button colorScheme="blue">Deposit Now</Button>
            </Stack>
          );
        }
        else if (propTemp.status == 2) {
          const dateTemp = new Date(propTemp.voting_end_time);
          setEndDate(
            <Stack>
              <Box fontSize="6xl">
                <Countdown date={dateTemp.valueOf()}>
                  <Completionist />
                </Countdown>
              </Box>
              <Text fontSize="xl">VOTE ENDING DATE</Text>
              <Text fontSize="2xl">{dateTemp.toLocaleString()}</Text>
              <Button colorScheme="blue">Vote Now</Button>
            </Stack>
          );
          console.log(dateTemp.valueOf(), Date.now());
        }
        else {
          const dateTemp = new Date(propTemp.voting_end_time);
          setEndDate(
            <Stack>
              <Box fontSize="6xl">
                <Countdown date={dateTemp.valueOf()}>
                  <Completionist />
                </Countdown>
              </Box>
              <Text fontSize="xl">VOTE ENDED DATE</Text>
              <Text fontSize="2xl">{dateTemp.toLocaleString()}</Text>
            </Stack>
          );
          console.log(dateTemp.valueOf(), Date.now());
        }

        // console.log(dateTemp.toDateString(), dateTemp.toLocaleString(), dateTemp.toUTCString(), dateTemp.toTimeString());

      }

      async function getProposal(propIdTemp: any) {

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
            console.log(govProposal);
            // console.log(JSON.stringify(govProposal.content));

            const govProposalTemp = JSON.stringify(govProposal.content);
            const propTypeTemp = govProposalTemp.split(':')[1].split('.')[3].split('\\')[0];
            setPropType(propTypes[propTypeTemp]);
            console.log(propTypes[propTypeTemp]);

            const govProposalTally = await terra.gov.tally(propIdTemp, {});
            console.log(govProposalTally);

            const voteAbstain = parseFloat(govProposalTally.abstain);
            console.log('Abstain: ' + voteAbstain);
            const voteNo = parseFloat(govProposalTally.no);
            console.log('No: ' + voteNo);
            const voteNoVeto = parseFloat(govProposalTally.no_with_veto);
            console.log('No with Veto: ' + voteNoVeto);
            const voteYes = parseFloat(govProposalTally.yes);
            console.log('Yes: ' + voteYes);

            const voteTotal = voteAbstain + voteNo + voteNoVeto + voteYes;
            console.log('Total: ' + voteTotal);

            // const voteAbstainPercent = ((voteAbstain / voteTotal) * 100);
            // console.log('Abstain %: ' + voteAbstainPercent);
            // const voteNoPercent = ((voteNo / voteTotal) * 100);
            // console.log('No %: ' + voteNoPercent);
            // const voteNoVetoPercent = ((voteNoVeto / voteTotal) * 100);
            // console.log('No with Veto %: ' + voteNoVetoPercent);
            // const voteYesPercent = ((voteYes / voteTotal) * 100);
            // console.log('Yes %: ' + voteYesPercent);

            const govPropTallyParams = await terra.gov.tallyParameters(propIdTemp, {});
            
            const govQuorum = parseFloat(govPropTallyParams.quorum);
            setGovQuorum(govQuorum);
            const govThreshold = parseFloat(govPropTallyParams.threshold);
            setGovThreshold(govThreshold);
            const govThresholdVeto = parseFloat(govPropTallyParams.veto_threshold);
            setGovThresholdVeto(govThresholdVeto);

            console.log(govQuorum, govThreshold, govThresholdVeto);

            const govPropParams = await terra.staking.pool({});
            const bondedTokens = parseFloat(govPropParams.bonded_tokens.amount);
            const nonBondedTokens = parseFloat(govPropParams.not_bonded_tokens.amount);
            const totalStakedTokens = bondedTokens + nonBondedTokens;
            // const bondedTokensPercent = ((bondedTokens / totalBondedTokens) * 100);
            // const nonBondedTokensPercent = ((nonBondedTokens / totalBondedTokens) * 100);
            // console.log('Total Staked Tokens: ' + totalStakedTokens);

            const totalVoted = (voteTotal / totalStakedTokens);
            const totalVotedTemp = (totalVoted * 100).toFixed(2);
            console.log('Total Votes: ' + totalVoted + ' >= ' + govQuorum);
            setTotalVoted(totalVotedTemp);
            setPropQuorum(totalVoted);

            const totalYes = ( voteYes / (voteYes + voteNo + voteNoVeto));
            console.log('Total Yes Votes: ' + totalYes + ' > ' + govThreshold);
            setPropThreshold(totalYes);

            const totalNoVeto = ( voteNoVeto / (voteYes + voteNo + voteNoVeto));
            console.log('Total No Veto Votes: ' + totalNoVeto + ' < ' + govThresholdVeto);
            setPropThresholdVeto(totalNoVeto);

            if ((totalVoted >= govQuorum) && (totalNoVeto < govThresholdVeto) && (totalYes > govThreshold)) {
              console.log('PASSING');
              setPassingColor('green.500');
            }
            else {
              console.log('NOT PASSING');
              setPassingColor('red.500');
            }

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

        <Container maxW="6xl" py={10}>

          <Box textAlign="left" marginBottom="10">

            <Link href="/proposals" _hover={{ textDecoration: 'none' }}>
              <Button colorScheme='blue' marginBottom="10">Back</Button>
            </Link>

            <Heading as="h1" fontSize="2xl">
              {govProp.content.title.charAt(0).toUpperCase() + govProp.content.title.slice(1).toLowerCase()}
            </Heading>

          </Box>

          <SimpleGrid columns={2} spacing={10} marginBottom="10">

            <Box textAlign="left">

              <Stack
                h="md"
                minH={36}
                p={5}
                justifyContent="center"
                borderRadius={5}
                boxShadow={getBoxShadow}
              >
                <SimpleGrid
                  columns={2}
                  spacing={0}
                  marginBottom="10"
                >
                  <Center>
                    <CircularProgress size='200px' thickness='5px' value={govTotalVoted} color={passingColor}>
                      <CircularProgressLabel fontSize="4xl">{govTotalVoted}%</CircularProgressLabel>
                    </CircularProgress>
                  </Center>
                  <Center>
                    <List spacing={3}>
                      <QuorumMsg />
                      <ThresholdMsg />
                      <ThresholdVetoMsg />
                    </List>
                  </Center>
                </SimpleGrid>
                <Progress colorScheme='green' size='sm' value={20} />
                <Progress colorScheme='green' size='md' value={20} />
                <Progress colorScheme='green' size='lg' value={20} />
                <Progress colorScheme='green' height='32px' value={20} />
                
              </Stack>

            </Box>

            <Box textAlign="center">

              <Stack
                h="md"
                minH={36}
                p={5}
                spacing={2.5}
                justifyContent="center"
                borderRadius={5}
                boxShadow={getBoxShadow}
              >

                <Text fontSize='3xl'>
                  Proposal No. #{govProp.id}
                </Text>
                {endDate}
                <Text fontSize="sm">{propType}</Text>
                
              </Stack>

            </Box>

          </SimpleGrid>

          <Box mb={3} marginBottom="10">
            <Divider />
          </Box>

          <Box textAlign="justify" marginBottom="10">

            <Text fontSize='lg'>
              {govProp.content.description}
            </Text>

          </Box>

          <Box mb={3}>
            <Divider />
          </Box>

        </Container>

      </VStack>
  );
}
