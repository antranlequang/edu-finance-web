// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./EduScoreNFT.sol";

contract ScholarshipPool is Ownable, ReentrancyGuard {
    
    struct Scholarship {
        uint256 id;
        string name;
        string description;
        uint256 totalFund;
        uint256 remainingFund;
        uint256 minEduScore;
        uint256 maxRecipients;
        uint256 currentRecipients;
        bool active;
        uint256 deadline;
        address sponsor;
    }
    
    struct Application {
        address applicant;
        uint256 scholarshipId;
        uint256 tokenId;
        string personalStatement;
        uint256 applicationTime;
        bool approved;
        bool funded;
    }
    
    EduScoreNFT public eduScoreContract;
    IERC20 public paymentToken;
    
    mapping(uint256 => Scholarship) public scholarships;
    mapping(uint256 => Application[]) public scholarshipApplications;
    mapping(address => mapping(uint256 => bool)) public hasApplied;
    
    uint256 public scholarshipCounter;
    uint256 public totalPoolFunds;
    
    event ScholarshipCreated(uint256 indexed scholarshipId, string name, uint256 totalFund, address sponsor);
    event ApplicationSubmitted(address indexed applicant, uint256 indexed scholarshipId, uint256 tokenId);
    event ApplicationApproved(address indexed applicant, uint256 indexed scholarshipId, uint256 amount);
    event FundsDeposited(address indexed sponsor, uint256 amount);
    event ScholarshipPaid(address indexed recipient, uint256 indexed scholarshipId, uint256 amount);
    
    constructor(address _eduScoreContract, address _paymentToken) {
        eduScoreContract = EduScoreNFT(_eduScoreContract);
        paymentToken = IERC20(_paymentToken);
    }
    
    function createScholarship(
        string memory name,
        string memory description,
        uint256 totalFund,
        uint256 minEduScore,
        uint256 maxRecipients,
        uint256 deadline
    ) public payable returns (uint256) {
        require(bytes(name).length > 0, "Scholarship name required");
        require(totalFund > 0, "Fund amount must be greater than 0");
        require(deadline > block.timestamp, "Deadline must be in the future");
        
        if (msg.value > 0) {
            require(msg.value == totalFund, "ETH amount must match total fund");
        } else {
            require(paymentToken.transferFrom(msg.sender, address(this), totalFund), "Token transfer failed");
        }
        
        uint256 scholarshipId = scholarshipCounter++;
        
        scholarships[scholarshipId] = Scholarship({
            id: scholarshipId,
            name: name,
            description: description,
            totalFund: totalFund,
            remainingFund: totalFund,
            minEduScore: minEduScore,
            maxRecipients: maxRecipients,
            currentRecipients: 0,
            active: true,
            deadline: deadline,
            sponsor: msg.sender
        });
        
        totalPoolFunds += totalFund;
        
        emit ScholarshipCreated(scholarshipId, name, totalFund, msg.sender);
        return scholarshipId;
    }
    
    function applyForScholarship(
        uint256 scholarshipId,
        uint256 tokenId,
        string memory personalStatement
    ) public {
        require(scholarships[scholarshipId].active, "Scholarship not active");
        require(block.timestamp < scholarships[scholarshipId].deadline, "Application deadline passed");
        require(!hasApplied[msg.sender][scholarshipId], "Already applied to this scholarship");
        require(eduScoreContract.ownerOf(tokenId) == msg.sender, "Not owner of the achievement NFT");
        
        (uint256 eduScore,,,, bool verified,) = eduScoreContract.achievements(tokenId);
        require(verified, "Achievement must be verified");
        require(eduScore >= scholarships[scholarshipId].minEduScore, "EduScore too low");
        
        scholarshipApplications[scholarshipId].push(Application({
            applicant: msg.sender,
            scholarshipId: scholarshipId,
            tokenId: tokenId,
            personalStatement: personalStatement,
            applicationTime: block.timestamp,
            approved: false,
            funded: false
        }));
        
        hasApplied[msg.sender][scholarshipId] = true;
        
        emit ApplicationSubmitted(msg.sender, scholarshipId, tokenId);
    }
    
    function approveApplication(uint256 scholarshipId, uint256 applicationIndex) public onlyOwner {
        require(scholarshipId < scholarshipCounter, "Invalid scholarship ID");
        require(applicationIndex < scholarshipApplications[scholarshipId].length, "Invalid application index");
        require(scholarships[scholarshipId].active, "Scholarship not active");
        require(scholarships[scholarshipId].currentRecipients < scholarships[scholarshipId].maxRecipients, "Max recipients reached");
        
        Application storage application = scholarshipApplications[scholarshipId][applicationIndex];
        require(!application.approved, "Application already approved");
        
        application.approved = true;
        scholarships[scholarshipId].currentRecipients++;
        
        uint256 amount = scholarships[scholarshipId].remainingFund / 
                        (scholarships[scholarshipId].maxRecipients - scholarships[scholarshipId].currentRecipients + 1);
        
        emit ApplicationApproved(application.applicant, scholarshipId, amount);
    }
    
    function disburseFunds(uint256 scholarshipId, uint256 applicationIndex) public onlyOwner nonReentrant {
        require(scholarshipId < scholarshipCounter, "Invalid scholarship ID");
        require(applicationIndex < scholarshipApplications[scholarshipId].length, "Invalid application index");
        
        Application storage application = scholarshipApplications[scholarshipId][applicationIndex];
        require(application.approved, "Application not approved");
        require(!application.funded, "Already funded");
        
        Scholarship storage scholarship = scholarships[scholarshipId];
        uint256 amount = scholarship.totalFund / scholarship.maxRecipients;
        require(scholarship.remainingFund >= amount, "Insufficient funds");
        
        application.funded = true;
        scholarship.remainingFund -= amount;
        
        if (address(paymentToken) != address(0)) {
            require(paymentToken.transfer(application.applicant, amount), "Token transfer failed");
        } else {
            payable(application.applicant).transfer(amount);
        }
        
        emit ScholarshipPaid(application.applicant, scholarshipId, amount);
    }
    
    function getScholarshipApplications(uint256 scholarshipId) public view returns (Application[] memory) {
        return scholarshipApplications[scholarshipId];
    }
    
    function getActiveScholarships() public view returns (Scholarship[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < scholarshipCounter; i++) {
            if (scholarships[i].active && block.timestamp < scholarships[i].deadline) {
                activeCount++;
            }
        }
        
        Scholarship[] memory activeScholarships = new Scholarship[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < scholarshipCounter; i++) {
            if (scholarships[i].active && block.timestamp < scholarships[i].deadline) {
                activeScholarships[index] = scholarships[i];
                index++;
            }
        }
        
        return activeScholarships;
    }
    
    function emergencyWithdraw() public onlyOwner {
        if (address(paymentToken) != address(0)) {
            uint256 balance = paymentToken.balanceOf(address(this));
            require(paymentToken.transfer(owner(), balance), "Token transfer failed");
        } else {
            payable(owner()).transfer(address(this).balance);
        }
    }
    
    function deactivateScholarship(uint256 scholarshipId) public onlyOwner {
        require(scholarshipId < scholarshipCounter, "Invalid scholarship ID");
        scholarships[scholarshipId].active = false;
    }
    
    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }
}