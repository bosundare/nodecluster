let Client = require('ssh2').Client


module.exports = {
    command: command
}

/**
 * SSH an array of commands.
 * @param {Object} sshOptions Parameters include command[array] to send, message(string) to use in logs, ip(string),
 * password(string), username(string)
 * @param {Function} callback Callback function err,data will be returned.
 */
function command (sshOptions, callback) {
    let prompts = [
        {prompt: 'Password: ', echo: false},
        {prompt: 'password: ', echo: false}
    ]
    let conn = new Client()
    conn.on('ready', () => {
        conn.shell((err, stream) => {
            if (err) {
                console.log(sshOptions.message + ' failed with message: ' + err)
                conn.end()
                return (err)
            }
            else {
                sshOptions.command.push('\n')
                stream.write(sshOptions.command[0] + '\n')
                sshOptions.command.shift()
                stream.on('close', (code, signal) => {
                    console.log(sshOptions.message + ' exited with code: ' + code)
                    conn.end()
                    if (code && code != 0) {
                        callback('Non-zero exit code of: ' + code)
                    }
                    else {
                        callback()
                    }
                })
                .on('data', data => {
                    // if (sshOptions.command.length > 0) {
                    //     stream.write(sshOptions.command[0] + '\n')
                    //     sshOptions.command.shift()
                    // }                    
                    //HACK TO MAKE THE STREAM KNOW WHEN TO SEND NEXT COMMAND
                    if (data.indexOf('~$') >= 0 || data.indexOf('#') >= 0 || data.indexOf('~]#') >= 0) {
                        if (sshOptions.command.length > 0) {
                            stream.write(sshOptions.command[0] + '\n')
                            sshOptions.command.shift()
                        }
                    }
                    console.log(sshOptions.message + ' out: ' + data)
                    return (null,data)
                })
                .stderr.on('data', data => {
                    console.log(sshOptions.message + ' failed with message: ' + data)
                    conn.end()
                    callback(data)
                })
                .on('end', () => {
                    conn.end()
                    //callback()
                })
            }
        })
    })
    .on('keyboard-interactive', (name, instructions, instructionsLang, prompts, finish) => {
        finish([sshOptions.password])
    })
    .on('error', err => {
        console.log(sshOptions.message + ' failed with message: ' + err)
        callback(err)
        conn.end()
    })
    .connect({
        host: sshOptions.ip,
        port: 22,
        username: sshOptions.username,
        password: sshOptions.password,
        readyTimeout: 999999,
        tryKeyboard: true
    })
}
