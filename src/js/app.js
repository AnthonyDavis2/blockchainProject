/*
var abi = require('ethereumjs-abi');
var ticketSale = web3.eth.contract(abi);
var TicketSale = addTic.at(0xBaC45c4A357d73cE015fC6ee73Dbe1cBF0458a75);

var event = TicketSale.addTic();

even.watch(function(error, result){
  if(!error)
    console.log(result);
});

*/
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',


  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    var status = $("#status");
    // This is the secret sauce to get Metamask to work with a dapp - It asks for authorization to access your accounts information
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        ethereum.enable();
      } catch (err) {
        $('#status').html('User denied account access', err)
      }
    } else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider)

    } else {
      $('#status').html('No Metamask (or other Web3 Provider) installed')
    }
    App.web3Provider = web3.currentProvider;

    return App.initContract();
  },

  initContract: function() {
  $.getJSON("Papercut.json", function(papercut) {
    // Instantiate a new truffle contract from the artifact
    App.contracts.Papercut = TruffleContract(papercut);
    // Connect provider to interact with contract
    App.contracts.Papercut.setProvider(App.web3Provider);

    // App.listenForEvents();

    return App.render();
  });
 },

 // Listen for events emitted from the contract
 // listenForEvents: function() {
 //   App.contracts.Papercut.deployed().then(function(instance) {
 //     // Restart Chrome if you are unable to receive this event
 //     // This is a known issue with Metamask
 //     // https://github.com/MetaMask/metamask-extension/issues/2393
 //     instance.Party({}, {
 //       fromBlock: 0,
 //       toBlock: 'latest'
 //     }).watch(function(error, event) {
 //       console.log("event triggered", event)
 //       // Reload when a new vote is recorded
 //       App.render();
 //     });
 //   });
 // },


 render: function() {
    var papercutInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    App.contracts.Papercut.deployed().then(function(instance){
      papercutInstance = instance;
      // return papercutInstance.eventName();
    }).then(function(eventName) {
      var eventNamePick = $('#eventNamePick');
      eventNamePick.empty();
    })
  },


  addEvent: function() {
    var eventNameId = $('eventName').Val();
    var dateId = $('eventDate').Val();
    var eventTimeId = $('eventTime').Val();
    var eventTimeEndId = $('eventTimeEnd').Val();
    App.contracts.Papercut.deployed().then(function(instance) {
      return instance.newTicketSale(eventNameId, dateId, eventTimeId, eventTimeEndId, { from: App.account });
    }).then(function(result) {
      //update user
      alert("Your event has been created.");
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
