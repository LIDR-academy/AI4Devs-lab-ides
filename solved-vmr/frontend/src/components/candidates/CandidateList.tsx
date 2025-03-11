import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  Text,
  useToast,
  Spinner,
  Link,
  Badge,
  VStack,
  Icon,
  useColorModeValue,
  VisuallyHidden,
  Tooltip,
} from '@chakra-ui/react';
import { AddIcon, DownloadIcon, ChevronLeftIcon, TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { Candidate } from '../../types/candidate';
import ThemeToggle from '../ThemeToggle';
import PageLayout from '../layout/PageLayout';

type SortField = 'name' | 'email' | 'phoneNumber' | 'education' | 'workExperience' | 'createdAt';
type SortOrder = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  order: SortOrder;
}

const CandidateList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'createdAt', order: 'desc' });
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('blue.50', 'blue.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch('http://localhost:3010/api/candidates');
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load candidates',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const sortData = (field: SortField) => {
    const order = sortConfig.field === field && sortConfig.order === 'asc' ? 'desc' : 'asc';
    setSortConfig({ field, order });

    const sortedCandidates = [...candidates].sort((a, b) => {
      let compareA: string | number | Date;
      let compareB: string | number | Date;

      switch (field) {
        case 'name':
          compareA = `${a.firstName} ${a.lastName}`.toLowerCase();
          compareB = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'email':
          compareA = a.email.toLowerCase();
          compareB = b.email.toLowerCase();
          break;
        case 'phoneNumber':
          compareA = a.phoneNumber || '';
          compareB = b.phoneNumber || '';
          break;
        case 'education':
          compareA = a.education || '';
          compareB = b.education || '';
          break;
        case 'workExperience':
          compareA = a.workExperience || '';
          compareB = b.workExperience || '';
          break;
        case 'createdAt':
          compareA = new Date(a.createdAt);
          compareB = new Date(b.createdAt);
          break;
        default:
          return 0;
      }

      if (compareA < compareB) return order === 'asc' ? -1 : 1;
      if (compareA > compareB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    setCandidates(sortedCandidates);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortConfig.field !== field) {
      return null;
    }
    const direction = sortConfig.order === 'asc' ? 'ascending' : 'descending';
    return (
      <>
        <Icon
          as={sortConfig.order === 'asc' ? TriangleUpIcon : TriangleDownIcon}
          ml={1}
          w={3}
          h={3}
          aria-hidden="true"
        />
        <VisuallyHidden>{`Sorted ${direction}`}</VisuallyHidden>
      </>
    );
  };

  if (isLoading) {
    return (
      <PageLayout>
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <Spinner 
            size="xl" 
            label="Loading candidates"
            aria-label="Loading candidates"
          />
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Box>
        <HStack justify="space-between" align="center" mb={6}>
          <Heading size="lg" color={headingColor}>Candidates</Heading>
          <Tooltip label="Add a new candidate" hasArrow>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={() => navigate('/add-candidate')}
              size="md"
              px={6}
              shadow="md"
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'lg',
              }}
              transition="all 0.2s"
              aria-label="Add new candidate"
            >
              Add New Candidate
            </Button>
          </Tooltip>
        </HStack>
        
        {candidates.length === 0 ? (
          <Box 
            textAlign="center" 
            py={10}
            role="alert"
            aria-label="No candidates found"
          >
            <Text fontSize="lg" color={textColor}>
              No candidates found. Add your first candidate to get started.
            </Text>
            <Button
              mt={4}
              colorScheme="blue"
              leftIcon={<AddIcon />}
              onClick={() => navigate('/add-candidate')}
              aria-label="Add your first candidate"
            >
              Add Candidate
            </Button>
          </Box>
        ) : (
          <Box 
            overflowX="auto"
            borderWidth="1px"
            borderRadius="lg"
            borderColor={borderColor}
            shadow="sm"
            role="region"
            aria-label="Candidates list"
          >
            <Table variant="simple">
              <Thead bg={headerBg}>
                <Tr>
                  {[
                    { key: 'name', label: 'Name' },
                    { key: 'email', label: 'Email' },
                    { key: 'phoneNumber', label: 'Phone' },
                    { key: 'education', label: 'Education' },
                    { key: 'workExperience', label: 'Experience' },
                    { key: 'cv', label: 'CV', sortable: false },
                    { key: 'createdAt', label: 'Added' },
                  ].map(({ key, label, sortable = true }) => (
                    <Th 
                      key={key}
                      cursor={sortable ? "pointer" : "default"}
                      onClick={() => sortable && sortData(key as SortField)}
                      _hover={sortable ? { bg: hoverBg } : undefined}
                      transition="all 0.2s"
                      py={4}
                      aria-sort={
                        sortConfig.field === key 
                          ? sortConfig.order === 'asc' 
                            ? 'ascending' 
                            : 'descending'
                          : undefined
                      }
                      role={sortable ? "columnheader" : undefined}
                      aria-label={sortable ? `Sort by ${label}` : undefined}
                    >
                      {label} {sortable && <SortIcon field={key as SortField} />}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {candidates.map((candidate) => (
                  <Tr 
                    key={candidate.id}
                    _hover={{
                      bg: hoverBg,
                      transform: 'translateY(-1px)',
                      shadow: 'sm',
                    }}
                    transition="all 0.2s"
                    role="row"
                  >
                    <Td fontWeight="medium">{`${candidate.firstName} ${candidate.lastName}`}</Td>
                    <Td>
                      <Link href={`mailto:${candidate.email}`}>
                        {candidate.email}
                      </Link>
                    </Td>
                    <Td>
                      {candidate.phoneNumber ? (
                        <Link href={`tel:${candidate.phoneNumber}`}>
                          {candidate.phoneNumber}
                        </Link>
                      ) : '-'}
                    </Td>
                    <Td>
                      <Badge 
                        colorScheme="blue" 
                        variant="subtle"
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        {candidate.education || '-'}
                      </Badge>
                    </Td>
                    <Td>
                      <Tooltip 
                        label={candidate.workExperience || 'No work experience provided'} 
                        hasArrow
                        placement="top"
                      >
                        <Text 
                          noOfLines={2}
                          maxW="200px"
                        >
                          {candidate.workExperience || '-'}
                        </Text>
                      </Tooltip>
                    </Td>
                    <Td>
                      {candidate.cvUrl ? (
                        <Link 
                          href={`http://localhost:3010${candidate.cvUrl}`} 
                          isExternal
                          aria-label={`Download CV for ${candidate.firstName} ${candidate.lastName}`}
                        >
                          <Button
                            size="sm"
                            leftIcon={<DownloadIcon />}
                            variant="outline"
                            colorScheme="blue"
                            _hover={{
                              bg: 'blue.50',
                              transform: 'translateY(-1px)',
                              shadow: 'sm',
                            }}
                            transition="all 0.2s"
                          >
                            Download
                          </Button>
                        </Link>
                      ) : (
                        <Badge 
                          colorScheme="yellow"
                          px={3}
                          py={1}
                          borderRadius="full"
                        >
                          No CV
                        </Badge>
                      )}
                    </Td>
                    <Td>{formatDate(candidate.createdAt)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </PageLayout>
  );
};

export default CandidateList; 