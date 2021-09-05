const { toBech32,generatePrivateKey,getAddressFromPrivateKey } = require('@harmony-js/crypto');
var argv = require('minimist')(process.argv.slice(2));
var Spinner = require('cli-spinner').Spinner;
var cluster = require('cluster');


var vanity = '';
if(argv.v === undefined){
    vanity = 'dad';
}else{
    vanity = argv.v;
}

var core = '';
if(argv.c === undefined){
    core = 4;
}else{
    core = parseInt(argv.c);
}


if (cluster.isMaster){

    for(var i = 1; i <= core; i++){
        console.log('RUNNING PROCESS ON CORE #' + i)
        var worker = cluster.fork()
        worker.on('message', function(msg) {
            console.log()
            console.log(msg);
        });
    }

    var spinner = new Spinner('Searching for vanity address starting with: ' + vanity)
    spinner.setSpinnerString(18)
    spinner.start()
}else if (cluster.isWorker) {
    var check = -1
    while(check !== 0){
var prv = generatePrivateKey();
var addrPrv = getAddressFromPrivateKey(prv);
var b32 = toBech32(addrPrv);
 // console.log(b32)
        check = b32.toLowerCase().indexOf('one1' + vanity.toLowerCase())
        if(check === 0){
            process.send({address: b32, privkey: prv})
            check = -1
        }
    }
}