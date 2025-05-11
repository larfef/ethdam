import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VaultModule = buildModule("VaultModule", (m) => {

	const deployer = m.getAccount(0);

	const vault = m.contract("Vault", [deployer]);

	return { vault };
});

export default VaultModule;