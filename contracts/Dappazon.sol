// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon {
    // State variables
    address public owner;

    // Structs
    struct Item {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    struct Order {
        uint256 time;
        Item item;
    }

    // Mappings
    mapping(uint256 => Item) public items;
    mapping(address => uint256) public orderCount; // orderId
    mapping(address => mapping(uint256 => Order)) public orders;

    // Events
    event List(
        uint256 id,
        string name,
        string category,
        string image,
        uint256 cost,
        uint256 rating,
        uint256 stock
    );

    event Buy(address buyer, uint256 orderId, uint256 itemId);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * List products
     * @dev List a new item on the Dappazon marketplace.
     * @param _id The unique identifier for the item.
     * @param _name The name of the item.
     * @param _category The category of the item.
     * @param _image The image URL of the item.
     * @param _cost The cost of the item.
     * @param _rating The rating of the item.
     * @param _stock The stock quantity of the item.
     */
    function list(
        uint256 _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
    ) public onlyOwner {
        // Create Item struct
        Item memory item = Item(
            _id,
            _name,
            _category,
            _image,
            _cost,
            _rating,
            _stock
        );
        // Save Item to blockchain
        items[_id] = item;

        // Emit event
        emit List(_id, _name, _category, _image, _cost, _rating, _stock);
    }

    /**
     * Buy products
     * @dev Allows a user to buy an item from the Dappazon marketplace.
     * @param _id The ID of the item to be purchased.
     */
    function buy(uint256 _id) public payable {
        // todo: receive Crypto

        // todo: fetch item
        Item memory item = items[_id];

        // * Require enough ether to buy item
        require(msg.value >= item.cost, "Not enough ether to buy item");

        // * Require item in stock
        require(item.stock > 0, "Item out of stock");

        // todo: create an order
        Order memory order = Order(block.timestamp, item);

        // todo: save order to blockchain
        orderCount[msg.sender]++;
        orders[msg.sender][orderCount[msg.sender]] = order;

        // todo: subtract stock
        items[_id].stock = item.stock - 1;

        // todo: emit event
        emit Buy(msg.sender, orderCount[msg.sender], _id);
    }

    /**
     * Withdraw Ether
     * @dev Allows the owner of the contract to withdraw the Ether balance from the contract.
     * @notice Only the contract owner can call this function.
     * @dev Emits a `Withdraw` event upon successful withdrawal.
     * @dev Throws an error if the withdrawal fails.
     */
    function withdraw() public onlyOwner {
        // * Transfer Ether to owner
        (bool success, ) = owner.call{ value: address(this).balance }("");
        require(success, "Failed to withdraw Ether");
    }
}
