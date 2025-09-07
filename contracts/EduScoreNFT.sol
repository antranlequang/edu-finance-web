// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EduScoreNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    struct Achievement {
        uint256 eduScore;
        string qualification;
        string institution;
        uint256 timestamp;
        bool verified;
        address verifier;
    }
    
    struct ScholarshipApplication {
        uint256 tokenId;
        string scholarshipName;
        uint256 amount;
        bool approved;
        uint256 applicationTime;
        string documents;
    }
    
    mapping(uint256 => Achievement) public achievements;
    mapping(address => uint256[]) public userAchievements;
    mapping(address => bool) public authorizedVerifiers;
    mapping(uint256 => ScholarshipApplication[]) public scholarshipApplications;
    mapping(address => uint256) public userLevels;
    
    event AchievementMinted(address indexed recipient, uint256 indexed tokenId, uint256 eduScore);
    event AchievementVerified(uint256 indexed tokenId, address indexed verifier);
    event ScholarshipApplied(address indexed applicant, uint256 indexed tokenId, string scholarshipName);
    event ScholarshipApproved(address indexed applicant, uint256 indexed tokenId, uint256 amount);
    event LevelUpgraded(address indexed user, uint256 newLevel);
    
    constructor() ERC721("EduScore Achievement", "EDUNFT") {}
    
    function mintAchievement(
        address to,
        uint256 eduScore,
        string memory qualification,
        string memory institution,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        achievements[tokenId] = Achievement({
            eduScore: eduScore,
            qualification: qualification,
            institution: institution,
            timestamp: block.timestamp,
            verified: false,
            verifier: address(0)
        });
        
        userAchievements[to].push(tokenId);
        _updateUserLevel(to);
        
        emit AchievementMinted(to, tokenId, eduScore);
        return tokenId;
    }
    
    function verifyAchievement(uint256 tokenId) public {
        require(authorizedVerifiers[msg.sender] || msg.sender == owner(), "Not authorized to verify");
        require(_exists(tokenId), "Token does not exist");
        
        achievements[tokenId].verified = true;
        achievements[tokenId].verifier = msg.sender;
        
        address tokenOwner = ownerOf(tokenId);
        _updateUserLevel(tokenOwner);
        
        emit AchievementVerified(tokenId, msg.sender);
    }
    
    function applyForScholarship(
        uint256 tokenId,
        string memory scholarshipName,
        uint256 amount,
        string memory documents
    ) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner of this achievement");
        require(achievements[tokenId].verified, "Achievement must be verified");
        
        scholarshipApplications[tokenId].push(ScholarshipApplication({
            tokenId: tokenId,
            scholarshipName: scholarshipName,
            amount: amount,
            approved: false,
            applicationTime: block.timestamp,
            documents: documents
        }));
        
        emit ScholarshipApplied(msg.sender, tokenId, scholarshipName);
    }
    
    function approveScholarship(uint256 tokenId, uint256 applicationIndex) public onlyOwner {
        require(applicationIndex < scholarshipApplications[tokenId].length, "Invalid application index");
        
        scholarshipApplications[tokenId][applicationIndex].approved = true;
        address applicant = ownerOf(tokenId);
        uint256 amount = scholarshipApplications[tokenId][applicationIndex].amount;
        
        emit ScholarshipApproved(applicant, tokenId, amount);
    }
    
    function addAuthorizedVerifier(address verifier) public onlyOwner {
        authorizedVerifiers[verifier] = true;
    }
    
    function removeAuthorizedVerifier(address verifier) public onlyOwner {
        authorizedVerifiers[verifier] = false;
    }
    
    function _updateUserLevel(address user) internal {
        uint256[] memory userTokens = userAchievements[user];
        uint256 totalScore = 0;
        uint256 verifiedCount = 0;
        
        for (uint256 i = 0; i < userTokens.length; i++) {
            Achievement memory achievement = achievements[userTokens[i]];
            totalScore += achievement.eduScore;
            if (achievement.verified) {
                verifiedCount++;
            }
        }
        
        uint256 newLevel = 1;
        if (verifiedCount >= 5 && totalScore >= 400) {
            newLevel = 5; // Expert
        } else if (verifiedCount >= 3 && totalScore >= 300) {
            newLevel = 4; // Advanced
        } else if (verifiedCount >= 2 && totalScore >= 200) {
            newLevel = 3; // Intermediate
        } else if (verifiedCount >= 1 && totalScore >= 100) {
            newLevel = 2; // Beginner+
        }
        
        if (newLevel > userLevels[user]) {
            userLevels[user] = newLevel;
            emit LevelUpgraded(user, newLevel);
        }
    }
    
    function getUserAchievements(address user) public view returns (uint256[] memory) {
        return userAchievements[user];
    }
    
    function getScholarshipApplications(uint256 tokenId) public view returns (ScholarshipApplication[] memory) {
        return scholarshipApplications[tokenId];
    }
    
    function getUserLevel(address user) public view returns (uint256) {
        return userLevels[user];
    }
    
    function getUserStats(address user) public view returns (
        uint256 totalAchievements,
        uint256 verifiedAchievements,
        uint256 totalScore,
        uint256 level
    ) {
        uint256[] memory userTokens = userAchievements[user];
        uint256 verified = 0;
        uint256 score = 0;
        
        for (uint256 i = 0; i < userTokens.length; i++) {
            Achievement memory achievement = achievements[userTokens[i]];
            score += achievement.eduScore;
            if (achievement.verified) {
                verified++;
            }
        }
        
        return (userTokens.length, verified, score, userLevels[user]);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}