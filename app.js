let cmnd = window.ethereum;
let contractAddres = "0x1A076518E9fA6b5748B0AdeAA200F38E1d31EdBb";
let contractAbi = [
    {
        "inputs": [],
        "name": "receiveBalance",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            }
        ],
        "name": "sendEthUser",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_num",
                "type": "uint256"
            }
        ],
        "name": "setValue",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "addr",
                "type": "address"
            }
        ],
        "name": "showDetail",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "accountBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "contractBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getValue",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

if (cmnd) {
    let provider = new ethers.providers.Web3Provider(cmnd);
    let signer = provider.getSigner();
    let contract = new ethers.Contract(contractAddres, contractAbi, signer);
    let amount = document.getElementById("amount");
    let connect = document.getElementById("connect");
    let rcvEth = document.getElementById("rcvEth");
    let contractBlnc = document.getElementById("contractBlnc");
    let shwContractBalance = document.getElementById("shwContractBalance");
    let name = document.getElementById("name");
    let userAmount = document.getElementById("amounts");
    let userAddress = document.getElementById("address");
    let userEt = document.getElementById("userEt");
    let userName = document.getElementById("userName");
    let dataTable = document.getElementById("showEventsData");

    let Connect = async () => {
        try {
            let req = await provider.send("eth_requestAccounts", []);
            name.innerHTML = "Status: Connected";
            connect.innerText = "Connected";
        } catch (e) {
            name.innerHTML = "Status: Not Connected";
            connect.innerText = "Connect to Wallet";
            console.log(e);
        }
    }

    let contractName = async () => {
        try {
            let names = await contract.name();
            name.innerHTML = `Status: ${names}`;
            name.innerHTML = `Status: Connected`;
            connect.innerText = "Connected";
        } catch (e) {
            name.innerHTML = "Status: Not Connected";
            connect.innerText = "Connect to Wallet";
            console.log(e);
        }
    }

    contractName();

    let contractBalance = async () => {
        try {
            let balance = await contract.contractBalance();
            contractBlnc.innerHTML = `Balance : ${ethers.utils.formatEther(balance)} Eth`;
        } catch (e) {
            contractBlnc.innerHTML = "Balance: Unable to fetch";
            console.log(e);
        }
    }

    let receiveEth = async () => {
        try {
            await contract.receiveBalance({ value: ethers.utils.parseEther(amount.value) });
            contractBalance();
        } catch (e) {
            console.log(e);
        }
    }

    let showAllEvents = async () => {
        try {
            let count = 0;
            let shwEvents = await contract.queryFilter("showDetail");
            
            shwEvents.map(data => {
                dataTable.innerHTML += `<tr>
                    <th>${++count}</th>
                    <th>${data.args.name}</th>
                    <th>${ethers.utils.formatEther(data.args.amount)}</th>
                    <th>${data.blockNumber}</th>
                    <td>${data.args.addr}</td></tr>`;
            });
        } catch (e) {
            console.log(e);
        }
    }

    let senEthToUser = async () => {
        try {
            await contract.sendEthUser(userAddress.value, ethers.utils.parseEther(userAmount.value), userName.value);
        } catch (e) {
            console.log(e);
        }
    }

    showAllEvents();
    connect.addEventListener("click", Connect);
    rcvEth.addEventListener("click", receiveEth);
    shwContractBalance.addEventListener("click", contractBalance);
    userEt.addEventListener("click", senEthToUser);

    // Handle account change and disconnection
    cmnd.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            name.innerHTML = "Status: Not Connected";
            connect.innerText = "Connect to Wallet";
        } else {
            name.innerHTML = "Status: Connected";
            connect.innerText = "Connected";
        }
    });

    cmnd.on('disconnect', (error) => {
        name.innerHTML = "Status: Not Connected";
        connect.innerText = "Connect to Wallet";
        console.log(error);
    });

    // Listen for events to update balance and table in real-time
    contract.on("showDetail", (name, amount, addr, event) => {
        let count = dataTable.rows.length + 1;
        dataTable.innerHTML += `<tr>
            <th>${count}</th>
            <th>${name}</th>
            <th>${ethers.utils.formatEther(amount)}</th>
            <th>${event.blockNumber}</th>
            <td>${addr}</td></tr>`;
        contractBalance(); // Update balance immediately
    });

} else {
    name.innerHTML = "Install MetaMask";
    connect.innerText = "Install MetaMask";
    console.log("Install MetaMask");
}
