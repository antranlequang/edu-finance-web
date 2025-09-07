const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying EduScore Smart Contracts...");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
    
    // Deploy EduScoreNFT contract
    const EduScoreNFT = await ethers.getContractFactory("EduScoreNFT");
    const eduScoreNFT = await EduScoreNFT.deploy();
    await eduScoreNFT.deployed();
    console.log("EduScoreNFT deployed to:", eduScoreNFT.address);
    
    // Deploy mock USDC token for testing (optional)
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const mockUSDC = await MockUSDC.deploy();
    await mockUSDC.deployed();
    console.log("MockUSDC deployed to:", mockUSDC.address);
    
    // Deploy ScholarshipPool contract
    const ScholarshipPool = await ethers.getContractFactory("ScholarshipPool");
    const scholarshipPool = await ScholarshipPool.deploy(eduScoreNFT.address, mockUSDC.address);
    await scholarshipPool.deployed();
    console.log("ScholarshipPool deployed to:", scholarshipPool.address);
    
    // Set up initial configuration
    console.log("Setting up initial configuration...");
    
    // Add scholarship pool as authorized verifier
    await eduScoreNFT.addAuthorizedVerifier(scholarshipPool.address);
    console.log("Added ScholarshipPool as authorized verifier");
    
    // Create sample scholarship
    const oneWeekFromNow = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);
    await scholarshipPool.createScholarship(
        "Future Leaders Scholarship",
        "Supporting the next generation of innovators",
        ethers.utils.parseEther("10"),
        70, // minimum EduScore
        5,  // max recipients
        oneWeekFromNow,
        { value: ethers.utils.parseEther("10") }
    );
    console.log("Sample scholarship created");
    
    console.log("\nDeployment Summary:");
    console.log("===================");
    console.log("EduScoreNFT:     ", eduScoreNFT.address);
    console.log("MockUSDC:        ", mockUSDC.address);
    console.log("ScholarshipPool: ", scholarshipPool.address);
    console.log("\nSave these addresses for frontend integration!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });