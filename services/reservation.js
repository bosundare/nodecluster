const Reservation = require('../models/reservation');
const moment = require('moment-timezone')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Cluster = require('../models/cluster');
const config = require('../config/secret');
let ssh = require('../config/newssh');
const logger = require('../config/logger')

setInterval(() => {
    start()
}, 20000)

const start = () => {
Reservation.findAll({
    where: {
        startDate: {[Op.lt]: moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')},
        status: {[Op.eq]: 'notapplied'}
    }, include: Cluster 

})
.then(
   reservation => {
       reservation.forEach(reservation => {
        if (reservation) {
            let runcomm1 = [
                "en",
                "conf t",
                "end",
                "exit"
                 ]
                let tor1Options = {
                ip: reservation.cluster.tor1ip,
                username: config.switchadmin,
                password: config.switchpass,
                command: runcomm1
            }
            ssh.command(tor1Options, (err,data) => 
    {if (err) {
      logger.crit(err+ ' for '+reservation.cluster.clustername + ' for ' + 'Reservation ID ' + reservation.id)
      reservation.update(
        {
            status: 'error'
        }
    )
      } 
      if (!err) {
        logger.info("Changed TOR1 Configs "+reservation.cluster.tor1ip + ' for' + reservation.id)
        let runcomm2 = [
            "en",
            "conf t",
            "end",
            "exit",
       ]
 
        let tor2Options = {
            ip: reservation.cluster.tor2ip,
            username: config.switchadmin,
            password: config.switchpass,
            command: runcomm2
        }
        
        ssh.command(tor2Options, (err,data) => 
        {if (err) {
            logger.crit(err)
            reservation.update(
                {
                    status: 'error'
                }
            )
          // console.log(err)
        } 
          if(!err) 
                {
                  logger.info('Added Vlan '+reservation.extravlan + ' to ' + reservation.cluster.clustername)
                  reservation.update(
                    {
                        status: 'applied'
                    }
                )
                  }
        })
        
    }
                        } 
)
        
        }
    })})}