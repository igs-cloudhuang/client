import prot from '../network/protocol/protocol.js';
import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('FishHitAckData')
export default class FishHitAckData extends Component {

    ack: prot.protocol.HitAckData;

}
