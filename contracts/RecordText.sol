// SPDX-License-Identifier: MIT
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.1/contracts/token/ERC20/ERC20.sol";

pragma solidity >=0.4.22 <0.9.0;

contract RecordTextForever {
    event Record(address owner, string text, string name, uint256 Number);

    mapping(uint256 => address) public ArticleWriter; //撰寫者Address
    mapping(uint256 => string) public ArticleContent; //文章編號對應內容
    mapping(address => uint256) writerArticles; //撰寫者對應編號

    uint256 ContText = 0; //內容編號

    struct Writer {
        address owner;
        string text;
        string name;
        uint256 number;
    }
    Writer[] public writers;

    // uint256 D =
    //     writers.push(Writer(msg.sender, "Test", "ContractOwner", ContText)); //此行沒用純此行沒用純測試測試

    function RecordText(string memory text, string memory name) public {
        //紀錄文address 文章內容 用戶名稱 文章編號
        ContText++;
        ArticleWriter[ContText] = msg.sender;
        ArticleContent[ContText] = text;
        writerArticles[msg.sender] = ContText;

        emit Record(msg.sender, text, name, ContText); //紀錄

        uint256 D = writers.push(Writer(msg.sender, text, name, ContText));
    }
}
