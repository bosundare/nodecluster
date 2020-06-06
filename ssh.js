let ssh = require('./config/newssh')

let runcomm = [
    'sh run int et6',
    'end',
    'conf t',
    'int et6',
    'sh act',
    'exit'

    
]

let sshOptions = {
    ip: '10.55.255.14', 
    username: 'bosun.dare',
    password: 'District9513',
    command: runcomm
}

ssh.command(sshOptions, (err,data) => {
    if (err) {
        console.log(err)
        
    }
    
})