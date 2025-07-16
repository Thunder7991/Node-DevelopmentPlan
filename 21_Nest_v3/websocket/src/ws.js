/*
 * @Author: thunderchen
 * @Date: 2025-07-16 21:27:19
 * @LastEditTime: 2025-07-16 22:09:16
 * @email: 853524319@qq.com
 * @Description: 
 */

const { EventEmitter } = require('events');
const http = require('http')
const crypto = require('crypto')
const OPCODES = {
    CONTINUE: 0,
    TEXT: 1, // 文本
    BINARY: 2, // 二进制
    CLOSE: 8,
    PING: 9,
    PONG: 10,
};
// 继承 EventEmitter 是为了可以用 emit 发送一些事件，外界可以通过 on 监听这个事件来处理。
class MyWebSocket extends EventEmitter {
    constructor(options) {
        super(options);
        const server = http.createServer();
        server.listen(options.port || 8080);
        server.on('upgrade', (req, socket) => {
            this.socket = socket;
            socket.setKeepAlive(true);

            const resHeaders = [
                'HTTP/1.1 101 Switching Protocols',
                'Upgrade: websocket',
                'Connection: Upgrade',
                'Sec-WebSocket-Accept: ' + hashKey(req.headers['sec-websocket-key']),
                '',
                ''
            ].join('\r\n');
            socket.write(resHeaders);

            socket.on('data', (data) => {
                this.processData(data);
            });
            socket.on('close', (error) => {
                this.emit('close');
            });
        });
    }
    processData (bufferData) {
        const byte1 = bufferData.readUInt8(0);
        let opcode = byte1 & 0x0f;
        const byte2 = bufferData.readUInt8(1);
        const str2 = byte2.toString(2);
        const MASK = str2[0];
        let payloadLength = parseInt(str2.substring(1), 2);
        let curByteIndex = 2;

        if (payloadLength === 126) {
            payloadLength = bufferData.readUInt16BE(2);
            curByteIndex += 2;
        } else if (payloadLength === 127) {
            payloadLength = bufferData.readBigUInt64BE(2);
            curByteIndex += 8;
        }

        let realData = null;

        if (MASK) {
            const maskKey = bufferData.slice(curByteIndex, curByteIndex + 4);
            curByteIndex += 4;
            const payloadData = bufferData.slice(curByteIndex, curByteIndex + payloadLength);
            realData = handleMask(maskKey, payloadData);
        } else {
            realData = bufferData.slice(curByteIndex, curByteIndex + payloadLength);;
        }

        this.handleRealData(opcode, realData);

    }
    handleRealData (opcode, realDataBuffer) {
        switch (opcode) {
            case OPCODES.TEXT:
                this.emit('data', realDataBuffer.toString('utf8'));
                break;
            case OPCODES.BINARY:
                this.emit('data', realDataBuffer);
                break;
            default:
                this.emit('close');
                break;
        }
    }

    send (data) {
        let opcode;
        let buffer;
        if (Buffer.isBuffer(data)) {
            opcode = OPCODES.BINARY;
            buffer = data;
        } else if (typeof data === 'string') {
            opcode = OPCODES.TEXT;
            buffer = Buffer.from(data, 'utf8');
        } else {
            console.error('暂不支持发送的数据类型')
        }
        this.doSend(opcode, buffer);
    }

    doSend (opcode, bufferDatafer) {
        this.socket.write(encodeMessage(opcode, bufferDatafer));
    }

}

function hashKey (key) {
    const sha1 = crypto.createHash('sha1');
    sha1.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
    return sha1.digest('base64');
}
function handleMask (maskBytes, data) {
    const payload = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
        payload[i] = maskBytes[i % 4] ^ data[i];
    }
    return payload;
}

function encodeMessage(opcode, payload) {
  //payload.length < 126
  let bufferData = Buffer.alloc(payload.length + 2 + 0);;
  
  let byte1 = parseInt('10000000', 2) | opcode; // 设置 FIN 为 1
  let byte2 = payload.length;

  bufferData.writeUInt8(byte1, 0);
  bufferData.writeUInt8(byte2, 1);

  payload.copy(bufferData, 2);
  
  return bufferData;
}

module.exports = MyWebSocket;