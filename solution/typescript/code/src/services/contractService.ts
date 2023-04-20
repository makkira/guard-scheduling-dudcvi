import { Contract } from "@exmpl/models/Contract";

export const contracts: Contract[] = [];

export function CreateContract(contract: Contract) {
  if (contract) {
    contracts.push(contract);
  } else {
    throw new Error(`Wrong input`);
  }
}

export function DeleteContract(contractName: string) {
  const contractIndex = contracts.findIndex(
    (contract) => contractName == contract.Name
  );
  if (contractIndex > -1) {
    contracts.splice(contractIndex, 1);
  } else {
    throw new Error(`${contractName} not found`);
  }
}
