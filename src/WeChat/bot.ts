import qrcodeTerminal from 'qrcode-terminal';
import {
    log,
    ScanStatus,
    WechatyBuilder,
    Message,
    Contact,
    RoomInvitation,
    Friendship
} from "wechaty";

const bot = WechatyBuilder.build({
    name: 'WeChaty-bot',
    puppet: 'wechaty-puppet-wechat4u'//Change this to the puppet you want
})

async function onMessage(message: Message) {

}

function onScan(qrcode: string, status: ScanStatus) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
        const qrcodeImageUrl = [
            'https://wechaty.js.org/qrcode/',
            encodeURIComponent(qrcode),
        ].join('')
        log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

        qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

    } else {
        log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
    }
}

/**
 * Automatically accept friendship
 * @param friendship 
 */
async function onFriendship(friendship: Friendship) {
    if (friendship.type() === bot.Friendship.Type.Receive)
        await friendship.accept();
}

/**
 * Automatically joins any room invitation
 * @param invitation 
 */
async function onRoomInvite(invitation: RoomInvitation) {
    try {
        await invitation.accept();
        log.info('Accepted invitation to ' + await invitation.topic());
    } catch (err) {
        log.info(err);
    }
}

function onLogin() { log.info("logged in"); }

function onLogout() { log.info("logged out"); }

bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);
bot.on('message', onMessage);
bot.on('friendship', onFriendship);
bot.on('room-invite', onRoomInvite);

await bot.start();