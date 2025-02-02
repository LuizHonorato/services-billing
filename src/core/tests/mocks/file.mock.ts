import { createObjectCsvStringifier } from 'csv-writer';

const mockCsvData = [
  {
    name: 'John Doe',
    email: 'johndoe@test.com',
    governmentId: '123456789',
    debtAmount: '100.00',
    debtDueDate: '2022-12-31',
    debtId: 'debt123',
  },
];

const mockFailedCsvData = [
  {
    name: null,
    email: 'johndoetest.com',
    governmentId: '123456789',
    debtAmount: '100.00',
    debtDueDate: '2022-12-31',
    debtId: 'debt123',
  },
];

export function writeMockCsv() {
  const csvWriter = createObjectCsvStringifier({
    header: [
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
      { id: 'governmentId', title: 'Government ID' },
      { id: 'debtAmount', title: 'Debt Amount' },
      { id: 'debtDueDate', title: 'Debt Due Date' },
      { id: 'debtId', title: 'Debt ID' },
    ],
  });

  return {
    headers: Object.keys(mockCsvData[0]).join(','),
    records: csvWriter.stringifyRecords(mockCsvData),
  };
}

export function writeFailedMockCsv() {
  const csvWriter = createObjectCsvStringifier({
    header: [
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
      { id: 'governmentId', title: 'Government ID' },
      { id: 'debtAmount', title: 'Debt Amount' },
      { id: 'debtDueDate', title: 'Debt Due Date' },
      { id: 'debtId', title: 'Debt ID' },
    ],
  });

  return {
    headers: Object.keys(mockFailedCsvData[0]).join(','),
    records: csvWriter.stringifyRecords(mockFailedCsvData),
  };
}
