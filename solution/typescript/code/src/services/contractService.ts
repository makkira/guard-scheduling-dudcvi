import { Contract } from "./../models/Contract";

export const contracts: Contract[] = [];

export function CreateContract(contract: Contract) {
  const contractIndex = contracts.findIndex(
    (c) => c.ContractName == contract.ContractName
  );

  if (contractIndex > -1)
    throw new Error(`${contract.ContractName} already exists`);

  if (!isCorrectInput(contract)) throw new Error(`Wrong input`);

  contracts.push(contract);
}

export function DeleteContract(contractName: string) {
  const contractIndex = contracts.findIndex(
    (c) => contractName == c.ContractName
  );
  if (contractIndex > -1) {
    contracts.splice(contractIndex, 1);
  } else {
    throw new Error(`${contractName} not found`);
  }
}

function isCorrectInput(contract: Contract): boolean {
  if (contract.DaysOfWeek.length === 0 || contract.ContractName === "")
    return false;
  return true;
}
