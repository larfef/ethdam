import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SimpleModule = buildModule("SimpleModule", (m) => {

	const deployer = m.getAccount(1);

	const Simple = m.contract("Simple", [deployer]);

	return { Simple };
});

export default SimpleModule;